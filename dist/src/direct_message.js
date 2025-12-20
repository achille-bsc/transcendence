import { prisma } from '../prisma';
async function newMessage(user_id, content) {
    const new_message = await prisma.globalChat.create({
        data: {
            userId: user_id,
            message: content
        }
    });
    await prisma.user.update({
        where: { id: user_id },
        data: {
            friend: {
                connect: { id: new_message.id_message },
            },
        },
    });
}
