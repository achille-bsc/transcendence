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

async function createUser(pseudo: string, email: string) {
  const newUser = await prisma.user.create({
    data: {
      pseudo: pseudo,
      email: email,
	  token: "test",
    },
  })
  return newUser
}

async function checkArgs() {
  if (process.argv.length !== 4)
  {
    console.error('Please provide exactly two arguments: email and pseudo.\nExample: npm run script')
  }
  else
  {
    if (!process.argv[3].includes('@') || process.argv[2].includes('@'))
    {
      console.error('The second argument must be a valid email address.')
    }
    else
    {
      const pseudoExists = await findProfile(process.argv[2])
      const emailExists = await findProfile(process.argv[3])
      if (!pseudoExists && !emailExists)
        createUser(process.argv[2], process.argv[3])
      else
        console.error('User with given email or pseudo already exists.')
    }
  }
}


async function main() {
	await checkArgs()
	const allUsers = await prisma.user.findMany()
	//await createFriendship(2,1)
	console.log(allUsers)
	console.log(await prisma.friend.findMany())
  console.log(await findProfile(1))
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