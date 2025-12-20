import fastify from 'fastify'
import { prisma, } from '../prisma'
import { getProfile } from './routes/auth'
import { createUser, signinValidations } from './routes/signin'
import { Prisma } from '../generated/prisma/client'
import { generateToken } from './utils'
import { findProfile } from '../src/script'
const server = fastify()


server.get('/coucou', async (request, reply) => {
  return 'pong\n'
})

server.listen({ port: 7979 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})


declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: number
      pseudo: string
      email: string
      token: string | null
    }
  }
}

interface ILogin {
  log_name: string;
  password: string;
}

interface ISignin {
  pseudo: string;
  mail: string;
  password: string;
}

interface IHeaders {
  'h-Custom': string;
}

interface IReply {
  200: { success: boolean };
  302: { url: string };
  '4xx': { error: string };
}

server.get<{
  Querystring: ILogin,
  Headers: IHeaders,
  Reply: IReply
}>('/auth', {
	preValidation: async (request, reply) => {
	const { log_name, password } = request.query
	const user = await getProfile(log_name, password, reply)
	request.user = user
  }
}, async (request, reply) => {
  const customerHeader = request.headers['h-Custom']
  const updatedUser = await prisma.user.update({
	where: { id: request.user!.id },
	data: { token: await generateToken() }
  })
  console.log(updatedUser)
  return { success: true }
})


server.get<{
  Querystring: ISignin,
  Headers: IHeaders,
  Reply: IReply
}>('/signin', {
	preValidation: async (request, reply) => {
	const { pseudo, mail, password } = request.query;
	await signinValidations(pseudo, mail, password, reply);
  }
}, async (request, reply) => {
  const customerHeader = request.headers['h-Custom']
  const newUser = await createUser(request.query.pseudo, request.query.mail, request.query.password, reply)
  console.log(newUser)
  return { success: true }
})