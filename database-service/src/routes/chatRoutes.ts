import { prisma } from '../../prisma'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function findUserByPseudo(pseudo: string) {
	const user = await prisma.user.findUnique({
  	where: { pseudo: pseudo },
 	select: {
    	pseudo: true,
  	}
	});
	if (!user)
		return null;
    return user;
}

export default async function ConversationRoutes(server: FastifyInstance) {
  server.post("/create-message", {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { senderId, conversationId, content } = request.body as {
      senderId: string;
      conversationId: string;
      content: string
    };
	const participant = await prisma.conversationParticipant.findFirst({
		where: {
			userId: senderId,
			conversation: {
				id: conversationId,
			},
		},
		include: {
			conversation: { include: { participants: true }}}});
	if (!participant)
		return { success: false, error: 'Sender is not a participant of the conversation' };
	const new_message = await prisma.message.create({
		data: {
			senderId: senderId,
			conversationId: conversationId,
			content: content
		},
		include: {
      		sender: { select: {pseudo: true } },
    },
  });
  return { success: true, new_message };
});

type FindDmConversationOptions = {
	beforeId?: number;
	limit?: number;
};

  server.post("/find-dm", {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { user1Pseudo, user2Pseudo, options } = request.body as {
      user1Pseudo: string;
      user2Pseudo: string;
      options?: FindDmConversationOptions
    };
{
	const user1 = await findUserByPseudo(user1Pseudo);
	const user2 = await findUserByPseudo(user2Pseudo);
	if (!user1 || !user2 || user1 === user2)
		return reply.code(400).send({ error: 'Invalid sender or receiver' });
	const rawLimit = options?.limit;
	const safeLimit =
		typeof rawLimit === "number" && Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : 50;
	const beforeId = options?.beforeId;
	const messageWhere =
		typeof beforeId === "number" && Number.isInteger(beforeId) && beforeId > 0 ? { id: { lt: beforeId } } : undefined;
	const convExists = await prisma.conversation.findFirst({
        where: {
            isGroup: false,
            AND: [{ participants: { some: { userId: user1Pseudo } } },
                  { participants: { some: { userId: user2Pseudo } } }]
        },
        include: {
            participants: {
                include: {
                    user: { select: {pseudo: true } },
                },
            },
            messages: {
                take: safeLimit,
				where: messageWhere,
                orderBy: { createdAt: 'desc' },
                include: {sender: { select: { pseudo: true} }}
          },
        },
    });
    if (convExists)
		  return convExists;  
    return reply.code(400).send({ error: 'Conversation not found' });
}});

  server.post("/create-dm", {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { senderPseudo, receiverPseudo, } = request.body as {
      senderPseudo: string;
      receiverPseudo: string;
    };
    const user1 = await findUserByPseudo(senderPseudo);
    const user2 = await findUserByPseudo(receiverPseudo);
    if (!user1 || !user2 || user1 === user2)
      return reply.code(400).send({ error: 'Invalid sender or receiver' });
    const convExists = await prisma.conversation.findFirst({
        where: {
            isGroup: false,
            AND: [
                { participants: { some: { userId: senderPseudo } } },
                { participants: { some: { userId: receiverPseudo } } }
            ]
        }});
	if (convExists)
		return convExists;
	const newConv = await prisma.conversation.create({
		 data: {
      isGroup: false,
      participants: {
        create: [ { userId: senderPseudo }, { userId: receiverPseudo }]}},
    include: {
      participants: {
        include: {
          user: { select: {pseudo: true } }
        },},
        messages: true },
	});
	return newConv;
});
}