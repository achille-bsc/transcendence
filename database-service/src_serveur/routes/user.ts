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
      where: { id: request.user.id },
      select: {
        id: true,
        pseudo: true,
        email: true,
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
        id: true,
        pseudo: true,
        email: true,
        createdAt: true,
        lastLoginAt: true,
      }
    });
    if (!user)
      return reply.code(404).send({ error: 'User not found' });
    return { user };
  });

  server.post('/finduserid', async (request, reply) =>{
    const { pseudo } = request.body as {
        pseudo: string;
    };
    const user = await findUserByPseudo(pseudo);
    if (!user)
      return reply.code(404).send({ error: 'User not found' });
    return { id: user.id };
});
}