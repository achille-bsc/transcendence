import bcrypt from 'bcrypt'

const saltRounds = 10

export async function generateToken() {
  let token = ""
  for (let i = 0; i < 16; i++) {
    token += Math.random().toString(16).substring(2)
  }
  return token
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}
export async function comparePassword(password: string, hashedPassword: string) {
	const match = await bcrypt.compare(password, hashedPassword)
	return match
}