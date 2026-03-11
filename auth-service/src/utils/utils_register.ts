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

export function checkSignin(pseudo: string, email: string, password: string): string | null
{
    if (!pseudo || !email || !password)
    {
        return 'All fields are required';
    }
    else if (password.length < 8)
    {
        return 'Password needs more than 8 characters';
    }
    else if (!email || email.length === 0 || email.includes(' ') ||
        email.split('@').length !== 2 || !email.includes('.'))
    {
        return 'Enter a valid email address';
    }
    else if (!pseudo || pseudo.length === 0 || pseudo.includes(' ') || pseudo.includes('@'))
    {
        return 'Bad pseudo';
    }
    return null;
}
