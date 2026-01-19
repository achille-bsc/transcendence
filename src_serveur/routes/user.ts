import { FastifyInstance } from 'fastify';
import { prisma } from '../../prisma';

export default async function userRoutes(server: FastifyInstance) {
  server.get('/checktoken', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    reply.code(200).send({ success: true });
  });

  server.get('/profile', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const userId = request.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
}