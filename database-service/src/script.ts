import { prisma } from '../prisma'
import { createFriendship } from './friends'

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