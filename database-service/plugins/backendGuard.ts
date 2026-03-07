import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface BackendGuardOptions {
  secret: string;
}

async function backendGuardPlugin(server: FastifyInstance, options: BackendGuardOptions) {
  server.decorate('requireBackendPass', async (request: FastifyRequest, reply: FastifyReply) => {
        
    const incomingPass = request.headers['x-backend-pass'];
    if (!incomingPass || incomingPass !== options.secret) {
      return reply.code(401).send({ error: 'Unauthorized Backend Access' });
    }
    const userPseudo = request.headers['x-user-pseudo'];
    if (userPseudo && typeof userPseudo === 'string') {
      request.userPseudo = { pseudo: userPseudo };
    }
  });
}

declare module 'fastify' {
  interface FastifyInstance {
    requireBackendPass: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    userPseudo?: { pseudo: string };
  }
}

export default fp(backendGuardPlugin);