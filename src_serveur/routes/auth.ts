import { findProfile } from '../../src/script'
import { prisma } from '../../prisma'
import { generateToken } from '../utils'

export async function handleGetProfile(mail: string, reply: any) {
    const user = await findProfile(mail)
	if (!user) 
	{
    	reply.code(404).send({ error: 'User not found' })
		return
	}
	else
	{
		console.log('User found:', user);
		user.token = await generateToken()
		await prisma.user.update({
			where: { id: user.id },
			data: { token: user.token }
		})
		reply.code(200).send({ success: true, token: user.token })
		return user
	}
}