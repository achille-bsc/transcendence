import { findProfile } from '../../src/script'
import { prisma } from '../../prisma'
import { generateToken, hashPassword, comparePassword } from '../utils'

export async function signinValidations(pseudo: string, mail: string, password: string, reply: any)
{
	if (password.length < 8)
	{
		reply.code(404).send({ error: 'Password need more than 8 charactere' })
		return
	}
	if (!mail || mail.length === 0 || mail.includes(' ') ||
		mail.split('@').length !== 2 || !mail.includes('.'))
	{
		reply.code(404).send({ error: 'Enter a valid email address' })
		return
	}
	if (!pseudo || pseudo.length === 0 || pseudo.includes(' ') || pseudo.includes('@'))
	{
		reply.code(404).send({ error: 'bad pseudo' })
		return
	}
}

export async function createUser(pseudo: string, mail: string, password: string, reply: any)
{
	const newUser = await prisma.user.create({
	data: {
		pseudo: pseudo,
		email: mail,
		token: await generateToken(),
		password: await hashPassword(password),
	},
	})
	return newUser
}
