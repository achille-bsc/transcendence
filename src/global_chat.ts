import { prisma } from '../prisma'

async function newGlobalMessage(user_id: number, content: string)
{
	const new_message = await prisma.globalChat.create({
		data: {
			userId: user_id,
			message: content
		}
	});
	await prisma.user.update({
    where: { id : user_id },
    data: {
      message_history: {
        connect: { id_message: new_message.id_message },
      },
    },
  });
}
