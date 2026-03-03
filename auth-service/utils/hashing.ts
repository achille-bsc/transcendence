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
