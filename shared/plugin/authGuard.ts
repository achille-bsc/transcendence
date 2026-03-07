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
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    try {
      const response = await fetch('api/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': authHeader
        }
      });
      if (!response.ok)
        return reply.code(401).send({ error: 'Invalid or expired token' });
      const userData = await response.json() as JwtPayload;
      request.user = userData;
    } catch (error) {
      server.log.error(error);
      return reply.code(500).send({ error: 'Authentication service unavailable' });
    }
  });
}

export default fp(authGuardPlugin);