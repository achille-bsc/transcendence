import { prisma } from '../prisma'

export async function newMessage(senderId: number, receiverId: number, content: string)
{
	const new_message = await prisma.directMessage.create({
		data: {
			senderId: senderId,
			receiverId: receiverId,
			message: content
		}
	});
	await prisma.user.update({
	where: { id : senderId },
	data: {
	  direct_messages: {
		connect: { id: new_message.id },
	  },
	},
  });
}