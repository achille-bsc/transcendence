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
      return null;
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
      select: { pseudo : true, avatar: true }
    });
    if (!user?.avatar)
      return { avatarUrl: '/public/default.png' };
    return { avatarUrl: `/public/${user.avatar}` };
  });

  server.post('/user/exists', {
    onRequest: [server.requireKey]
  }, async (request, reply) => {
    const { pseudo } = request.body as { pseudo: string };
    const user = await prisma.user.findUnique({
      where: { pseudo },
      select: { pseudo: true }
    });
    if (!user)
      return null;
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

  server.post('/user/email', {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { pseudo } = request.body as { pseudo: string };
    const user = await prisma.user.findUnique({
      where: { pseudo },
      select: { email: true }
    });

    if (!user)
      return null;

    return { email: user.email };
  });

  server.put('/user/update-apikey', {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { pseudo, apiKey } = request.body as { pseudo: string; apiKey: string };
    
    try {
      const user = await prisma.user.update({
        where: { pseudo },
        data: { apiKey }
      });      
      return { success: true, user: { pseudo: user.pseudo } };
    } catch (error: any) {
      server.log.error(error);
      return reply.code(500).send({ error: "Error recording API key" });
    }
  });

  server.post('/user/verify-apikey', {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { apiKey } = request.body as { apiKey: string };

    if (!apiKey || typeof apiKey !== 'string') {
      return reply.code(400).send({ error: 'API Key is required' });
    }

    try {
      const user = await prisma.user.findFirst({
        where: { apiKey: apiKey },
        select: { pseudo: true} 
      });
      if (!user) {
        return reply.code(401).send({ error: 'Invalid API Key' });
      }
      return { success: true, user: user };
    } catch (error) {
      server.log.error(error);
      return reply.code(500).send({ error: 'Internal server error verifying API key' });
    }
  });
  
}