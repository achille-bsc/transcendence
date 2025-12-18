import fastify from 'fastify'
import { findProfile } from '../src/script'
import { prisma } from '../prisma'
import { handleGetProfile } from './routes/auth'

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

interface IQuerystring {
  mail: string;
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
  Querystring: IQuerystring,
  Headers: IHeaders,
  Reply: IReply
}>('/auth', {
  preValidation: async (request, reply, done) => {
	// parsing
	// verif api key
	// code
    const { mail } = request.query
    await handleGetProfile(mail, reply).then(() => done()).catch((err) => {
		console.error('Error in handleGetProfile:', err);
		reply.code(400).send({ error: 'Internal Server Error' });
	});
  }
}, async (request, reply) => {
  const customerHeader = request.headers['h-Custom']
  // do something with request data
  return { success: true }
})
