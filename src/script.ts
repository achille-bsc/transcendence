import { prisma } from '../prisma'
import { createFriendship } from './friends'

export async function findProfile(input: string | number) {
  let whereClause = {}

  if (typeof input === 'number')
    whereClause = { id: input }
  else if (input.includes('@'))
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

async function main() {
	const allUsers = await prisma.user.findMany()
	//await createFriendship(2,1)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })