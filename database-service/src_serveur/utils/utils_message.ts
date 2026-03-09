import { prisma } from '../../prisma'
import { findUserByPseudo } from './utils_user';

export async function newDirectMessage(senderId: string, conversationId: string, content: string)
{
	const participant = await prisma.conversationParticipant.findFirst({
		where: {
			userId: senderId,
			conversation: {
				id: conversationId,
			},
		},
		include: {
			conversation: {
				include: {
					participants: true,
				},
			},
		},
	});
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
}

type FindDmConversationOptions = {
	beforeId?: number;
	limit?: number;
};

export async function findDmConvesation(
	user1Pseudo: string,
	user2Pseudo: string,
	options?: FindDmConversationOptions
)
{
	const user1 = await findUserByPseudo(user1Pseudo);
	const user2 = await findUserByPseudo(user2Pseudo);
	if (!user1 || !user2 || user1 === user2)
		return null;
	const rawLimit = options?.limit;
	const safeLimit =
		typeof rawLimit === "number" && Number.isInteger(rawLimit) && rawLimit > 0
			? Math.min(rawLimit, 100)
			: 50;
	const beforeId = options?.beforeId;
	const messageWhere =
		typeof beforeId === "number" && Number.isInteger(beforeId) && beforeId > 0
			? { id: { lt: beforeId } }
			: undefined;
	const convExists = await prisma.conversation.findFirst({
        where: {
            isGroup: false,
            AND: [
                { participants: { some: { userId: user1Pseudo } } },
                { participants: { some: { userId: user2Pseudo } } }
            ]
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
    return null;
}

export async function createDmConversation(user1Pseudo: string, user2Pseudo: string)
{
	const user1 = await findUserByPseudo(user1Pseudo);
	const user2 = await findUserByPseudo(user2Pseudo);
	if (!user1 || !user2 || user1 === user2)
		return null;
	const convExists = await prisma.conversation.findFirst({
        where: {
            isGroup: false,
            AND: [
                { participants: { some: { userId: user1Pseudo } } },
                { participants: { some: { userId: user2Pseudo } } }
            ]
        }});
	if (convExists)
		return convExists;
	const newConv = await prisma.conversation.create({
		 data: {
      isGroup: false,
      participants: {
        create: [
          { userId: user1Pseudo },
          { userId: user2Pseudo },
        ],
      },
    },
    include: {
      participants: {
        include: {
          user: { select: {pseudo: true } },
        },
      },
      messages: true,
    },
	});
	return newConv;
}