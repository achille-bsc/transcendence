import bcrypt from 'bcrypt'

const saltRounds = 10

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}
export async function comparePassword(password: string, hashedPassword: string) {
	const match = await bcrypt.compare(password, hashedPassword)
	return match
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
    return true
}
