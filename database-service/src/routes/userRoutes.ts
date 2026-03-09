import { prisma } from '../../prisma';
import { FastifyInstance } from 'fastify';

export default async function userRoutes(server: FastifyInstance) {

  server.post('/user/profile', {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { pseudo } = request.body as { pseudo: string };
    const user = await prisma.user.findUnique({
      where: { pseudo },
      select: { pseudo: true, createdAt: true, avatar: true }
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

  server.post('/user/avatar', {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { pseudo } = request.body as { pseudo: string };
    const user = await prisma.user.findUnique({
      where: { pseudo },
      select: { avatar: true }
    });
    if (!user?.avatar)
      return reply.code(404).send({ error: 'Avatar not found' });
    return { avatarUrl: `/public/${user.avatar}` };
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

  server.put('/user/update-email', {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { pseudo, email } = request.body as { pseudo: string; email: string };
    
    try {
      const user = await prisma.user.update({
        where: { pseudo },
        data: { email }
      });
      return { success: true, user: { pseudo: user.pseudo, email: user.email } };
    } catch (error: any) {
      if (error.code === 'P2002') {
        return reply.code(409).send({ error: 'This email is already used by another account' });
      }
      
      server.log.error(error);
      return reply.code(500).send({ error: 'Error updating email' });
    }
  });

  
}