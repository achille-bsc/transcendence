import { prisma } from '../../prisma'
import { findUserById } from './utils_user';

export async function newDirectMessage(senderId: number, conversationId: number, content: string)
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
      		sender: { select: { id: true, pseudo: true } },
    },
  });
  return { success: true, new_message };
}

export async function createDmConversation(user1id: number, user2id: number)
{
	const user1 = await findUserById(user1id);
	const user2 = await findUserById(user2id);
	if (!user1 || !user2 || user1 === user2)
		return null;
	const convExists = await prisma.conversation.findFirst({
		where : {
			isGroup: false,
			participants: {
				every: {
					AND: [
						{ userId: user1.id },
						{ userId: user2.id }
					]
				}
			}
		},
		include: {
			participants: {
				include: {
					user: { select: { id: true, pseudo: true } },
				},
			},
			messages: {
				orderBy: { createdAt: 'asc' },
				include: {
					sender: { select: { id: true, pseudo: true } },
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
          { userId: user1.id },
          { userId: user2.id },
        ],
      },
    },
    include: {
      participants: {
        include: {
          user: { select: { id: true, pseudo: true } },
        },
      },
      messages: true,
    },
	});
	return newConv;
}