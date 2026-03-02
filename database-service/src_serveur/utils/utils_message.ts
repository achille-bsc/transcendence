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
        },
        include: {
            participants: {
                include: {
                    user: { select: {pseudo: true } },
                },
            },
            messages: {
                orderBy: { createdAt: 'asc' },
                include: {
                    sender: { select: {pseudo: true } },
                },
            },
        },
    });
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