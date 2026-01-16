import { findProfile } from '../../src/script'
import { prisma } from '../../prisma'
import { hashPassword, comparePassword } from '../utils/hashing'

export async function signinValidations(pseudo: string, email: string, password: string, reply: any)
{
	if (!pseudo || !email || !password)
	{
		reply.code(404).send({ error: 'All field are required' })
		return false
	}
	else if (password.length < 8)
	{
		reply.code(404).send({ error: 'Password need more than 8 charactere' })
		return false
	}
	else if (!email || email.length === 0 || email.includes(' ') ||
		email.split('@').length !== 2 || !email.includes('.'))
	{
		reply.code(404).send({ error: 'Enter a valid email address' })
		return false
	}
	else if (!pseudo || pseudo.length === 0 || pseudo.includes(' ') || pseudo.includes('@'))
	{
		reply.code(404).send({ error: 'bad pseudo' })
		return false
	}
	const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { pseudo },
        { email }
      ]
    }
	});
	if (existing)
    {
		reply.code(404).send({ error: 'Pseudo or email already used' })
		return false
	};
	return true
}

export async function createUser(pseudo: string, email: string, password: string, reply: any)
{
	const newUser = await prisma.user.create({
	data: {
		pseudo: pseudo,
		email: email,
		password: await hashPassword(password),
	},
	select: {
      id: true,
      pseudo: true,
      email: true
    }
	})
	return newUser
}
