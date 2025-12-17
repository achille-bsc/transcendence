import { prisma } from '../prisma'
import { deleteRelation } from './friends'

export async function createBlock(blocker: number, blocked: number)
{

	if (blocker === blocked)
		return ;
    const block = await prisma.block.findFirst({where: { userId: blocker, blockedId: blocked }})
	if (block)
		console.log(`User ${blocker} has already blocked User ${blocked}.`)
	else
	{
		deleteRelation(blocker, blocked);
		await prisma.block.create({
			data: {
				userId: blocker,
				blockedId: blocked,
			},
		});
		await prisma.user.update({
			where: { id : blocker },
			data: {
				blocked: {
					connect: { id: blocked},
				},
			},
		});
		console.log(`User ${blocker} has blocked User ${blocked}.`)
	}
}

export async function deleteBlock(first_id: number, second_id: number)
{
  await prisma.block.deleteMany({
	where: { userId: first_id, blockedId: second_id },
  });
}
