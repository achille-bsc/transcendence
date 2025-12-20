import { findProfile } from '../../src/script'
import { prisma } from '../../prisma'
import { generateToken, comparePassword } from '../utils'

export async function getProfile(log_name: string, password: string, reply: any) {
	if (log_name.includes('@'))
	{
		if (!log_name || log_name.length === 0 || log_name.includes(' ') ||
			log_name.split('@').length !== 2 || !log_name.includes('.'))
		{
			reply.code(404).send({ error: 'bad mail' })
			return
		}
	}
	else
	{
		if (!log_name || log_name.length === 0 || log_name.includes(' '))
		{
			reply.code(404).send({ error: 'bad pseudo' })
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