import { prisma } from '../../prisma'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';

try {
  fs.accessSync('/run/secrets/api_pass', fs.constants.R_OK);
} catch (err) {
  console.error("Error: Unable to read API password from /run/secrets/api_pass. Please ensure the file exists and has the correct permissions.");
  process.exit(1);
}
const api_pass = fs.readFileSync('/run/secrets/api_pass', 'utf-8').trim();


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

export default async function chatRoutes(server: FastifyInstance) {
  server.post("/create-message", {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { senderId, conversationId, content } = request.body as {
      senderId: string;
      conversationId: number;
      content: string
    };
	console.log("lolololololool\n\n\n\n\n\n\n\n\n");
  const parsedConversationId = typeof conversationId === 'string' ? parseInt(conversationId, 10) : conversationId;
  const participant = await prisma.conversationParticipant.findFirst({
		where: {
			userId: senderId,
			conversation: {
				id: parsedConversationId,
			},
		},
		include: {
			conversation: { include: { participants: true }}}});
	if (!participant)
		return { success: false, error: 'Sender is not a participant of the conversation' };
  console.error(`Caca2`);
	const new_message = await prisma.message.create({
		data: {
			senderId: senderId,
			conversationId: parsedConversationId,
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
  const { user1Pseudo, user2Pseudo } = request.body as {
    user1Pseudo: string;
    user2Pseudo: string;
  };
  console.log("1\n\n\n\n\n\n\n\n\n");
  const user1 = await findUserByPseudo(user1Pseudo);
  const user2 = await findUserByPseudo(user2Pseudo);
  if (!user1 || !user2 || user1.pseudo === user2.pseudo)
    return reply.code(400).send({ error: 'Invalid sender or receiver' });
  console.log("2\n\n\n\n\n\n\n\n\n");
  const convExists = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { userId: user1Pseudo } } },
        { participants: { some: { userId: user2Pseudo } } }
      ]
    }
  });
  console.log("3\n\n\n\n\n\n\n\n\n");
  console.log("Existing conversation:", convExists);
  if (convExists)
    return { success: true, conversation: convExists };
  console.log("4\n\n\n\n\n\n\n\n\n");
  const newConv = await prisma.conversation.create({
    data: {
      isGroup: false,
      participants: {
        create: [{ userId: user1Pseudo }, { userId: user2Pseudo }]
      }
    },
    include: {
      participants: { include: { user: { select: { pseudo: true } } } },
      messages: true
    },
  });
  console.log("5\n\n\n\n\n\n\n\n\n");
  return { success: true, conversation: newConv.id };
});
}