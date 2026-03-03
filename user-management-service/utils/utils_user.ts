import { prisma } from '../../prisma';
import { hashPassword } from './hashing';

export async function findUserByPseudo(pseudo: string) {
	const user = await prisma.user.findUnique({
  	where: { pseudo: pseudo },
 	select: {
    	pseudo: true,
  	}
	});
	if (!user)
		return null;
    return user;
}