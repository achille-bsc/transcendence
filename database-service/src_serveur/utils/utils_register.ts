import { hashPassword, comparePassword } from './hashing';
import { prisma } from '../../prisma'

export async function checkLogin(log_name: string, password: string, reply: any) {
	if (log_name.includes('@'))
	{
		if (!log_name || log_name.length === 0 || log_name.includes(' ') ||
			  log_name.split('@').length !== 2 || !log_name.includes('.'))
			return reply.code(404).send({ error: 'Bad email' });
	}
	else
		if (!log_name || log_name.length === 0 || log_name.includes(' '))
			return reply.code(404).send({ error: 'Bad pseudo' })
  const user = await findProfile(log_name)
	if (!user || await comparePassword(password, user!.password) === false) 
	{
    	reply.code(404).send({ error: 'User not found, check your password and your pseudo/email' })
		return
	}
	else
		return user
}

export async function findProfile(input: string) {
  let whereClause = {}

  if (input.includes('@'))
    whereClause = { email: input }
  else
    whereClause = { pseudo: input }
  const user = await prisma.user.findFirst({
    where: whereClause,
  })
  if (user)
   return user
  else
    return null
}

export async function checkSignin(pseudo: string, email: string, password: string, reply: any)
{
    if (!pseudo || !email || !password)
    {
        reply.code(404).send({ error: 'All fields are required' })
        return false
    }
    else if (password.length < 8)
    {
        reply.code(404).send({ error: 'Password needs more than 8 characters' })
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
        reply.code(404).send({ error: 'Bad pseudo' })
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
      pseudo: true,
      email: true
    }
	})
	return newUser
}