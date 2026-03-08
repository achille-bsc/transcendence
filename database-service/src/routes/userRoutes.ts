import { prisma } from '../../prisma';
import { FastifyInstance } from 'fastify';

export default async function userRoutes(server: FastifyInstance) {

  server.post('/user/profile', {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { pseudo } = request.body as { pseudo: string };
    const user = await prisma.user.findUnique({
      where: { pseudo },
      select: { pseudo: true, createdAt: true, lastLoginAt: true, avatar: true }
    });
    if (!user)
      return reply.code(404).send({ error: 'User not found' });
    return user;
  });

  server.post('/user/update-avatar', {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { pseudo, avatar } = request.body as { pseudo: string; avatar: string };
    const user = await prisma.user.update({
      where: { pseudo },
      data: { avatar }
    });
    return { success: true, user };
  });

  server.post('/user/exists', {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { pseudo } = request.body as { pseudo: string };
    const user = await prisma.user.findUnique({
      where: { pseudo },
      select: { pseudo: true }
    });
    if (!user)
      return reply.code(404).send({ error: 'User not found' });
    return user;
  });
  
}