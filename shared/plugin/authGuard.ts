import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export interface JwtPayload {
  pseudo: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload;
  }
}

async function authGuardPlugin(server: FastifyInstance) {
  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.code(200).send({ success: false, error: 'Unauthorized' });
    }
    try {
      const response = await fetch("https://auth-service:3001/validate", {
        method: 'GET',
        headers: {
          'Authorization': authHeader
        }
      });
      const userData = await response.json() as JwtPayload & { success?: boolean; error?: string };
      if (!response.ok || userData.success === false)
        return reply.code(200).send({ success: false, error: userData.error || 'Invalid or expired token' });
      request.user = userData;
    } catch (error) {
      server.log.error(error);
      return reply.code(200).send({ success: false, error: 'Authentication service unavailable' });
    }
  });
}

export default fp(authGuardPlugin);