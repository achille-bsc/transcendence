import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../prisma';

export default async function authRoutes(server: FastifyInstance) {
    server.post('/createuser', { onRequest: [server.requireBackendPass]}, 
    async (request, reply) => {
    const { pseudo, email, password } = request.body as {
		pseudo: string,
		email: string,
		password: string };
    const existingUser = await prisma.user.findUnique({
      where: { pseudo: pseudo },
    });
    if (existingUser)
      return reply.code(400).send({ error: 'Username already exists' });
    const existingEmail = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingEmail) 
      return reply.code(400).send({ error: 'Email already in use' });
	  const newUser = await prisma.user.create({
	  data: {
		  pseudo: pseudo,
		  email: email,
		  password: password,
	  },
	  select: {pseudo: true}})
	  return newUser;});

    server.post('/finduser', { onRequest: [server.requireBackendPass]}, 
    async (request, reply) => {
    const { log_name } = request.body as {log_name: string };
    const existingUser = await prisma.user.findUnique({
      where: { pseudo: log_name },
      select : { pseudo: true, email: true, password: true }
    });
    if (existingUser)
        return existingUser;
    const existingEmail = await prisma.user.findUnique({
      where: { email: log_name },
      select : { pseudo: true, email: true, password: true }
    });
    if (existingEmail)
        return existingEmail;
    return reply.code(400).send({ error: 'User not found' })});
};