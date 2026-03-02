import { FastifyInstance } from 'fastify';
import { prisma } from '../../prisma';
import { findUserByPseudo } from '../utils/utils_user';

export default async function userRoutes(server: FastifyInstance) {
  server.post('/checktoken', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    reply.code(200).send({ success: true });
  });

  server.post('/profileuser', { onRequest: [server.authenticate]},
    async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { pseudo: request.user.pseudo },
      select: {
        pseudo: true,
        createdAt: true,
        lastLoginAt: true,
      }
    });
    if (!user)
      return reply.code(404).send({ error: 'User not found' });
    return { user };
  });

  server.post('/profileother', { onRequest: [server.authenticate]}, 
    async (request, reply) => {
    const { pseudo } = request.body as {
        pseudo: string;
    };
    const user = await prisma.user.findUnique({
      where: { pseudo: pseudo },
      select: {
        pseudo: true,
        createdAt: true,
        lastLoginAt: true,
      }
    });
    if (!user)
      return reply.code(404).send({ error: 'User not found' });
    return { user };
  });
}