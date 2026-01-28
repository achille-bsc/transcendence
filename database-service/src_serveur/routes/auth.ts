import { findProfile } from '../../src/script'
import { prisma } from '../../prisma'
import { comparePassword } from '../utils/hashing'

export async function getProfile(log_name: string, password: string, reply: any) {
	if (log_name.includes('@'))
	{
		if (!log_name || log_name.length === 0 || log_name.includes(' ') ||
			log_name.split('@').length !== 2 || !log_name.includes('.'))
		{
			reply.code(404).send({ error: 'Bad email' })
			return
		}
	}
	else
	{
		if (!log_name || log_name.length === 0 || log_name.includes(' '))
		{
			reply.code(404).send({ error: 'Bad pseudo' })
			return
		}
	}
    const user = await findProfile(log_name)
	if (!user || await comparePassword(password, user!.password) === false) 
	{
    	reply.code(404).send({ error: 'User not found, Check your password and your pseudo/mail' })
		return
	}
	else
	{
		return user
	}
}
