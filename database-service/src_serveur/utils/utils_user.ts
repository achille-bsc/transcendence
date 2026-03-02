import { prisma } from '../../prisma';
import { hashPassword } from './hashing';

export async function findUserByPseudo(pseudo: string) {
	const user = await prisma.user.findUnique({
  	where: { pseudo: pseudo },
 	omit: {
    	password: true,
    	email: true,
  	}
	});
	if (!user)
		return null;
    return user;
}

export async function findUserById(id: number) {
	const user = await prisma.user.findUnique({
		where: { id: id },
	});
	console.log(user);
	if (!user)
		return null;
	return user;
}