import { prisma } from '../../prisma'
import { findUserById } from './utils_user';
import { websocketRoutes } from '../routes/websocket';

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
	const messageData = JSON.stringify({
    type: 'new_message',
    conversationId,
    data: new_message,
  });

  participant.conversation.participants.forEach(({ userId }) => {
    const socket = clients.get(userId);
    if (socket?.readyState === 1) {
      socket.send(messageData);
    }
  });

  return { success: true, message };
}

export async function createDmConversation(user1id: number, user2id: number)
{
	const user1 = await findUserById(user1id);
	const user2 = await findUserById(user2id);
	if (!user1 || !user2)
		return null;
	if (user1 === user2)
		return null;
	const convExists = await prisma.conversation.findFirst({
		where : {
			isGroup: false,
			//AND:{
			participants: {
				every: {
					OR: [
						{ userId: user1.id },
						{ userId: user2.id }
					]
				}
		//	}
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