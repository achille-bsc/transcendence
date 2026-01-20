import { prisma } from '../../prisma';

export async function findUserByPseudo(pseudo: string) {
	const user = await prisma.user.findUnique({
        where: { pseudo: pseudo },
    });
    return user;
}

export async function findUserById(id: number) {
	const user = await prisma.user.findUnique({
		where: { id: id },
	});
	return user;
}