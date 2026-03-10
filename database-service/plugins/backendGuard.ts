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

  server.decorate('requireKey', async (request: FastifyRequest, reply: FastifyReply) => {
    
    const backendPass = request.headers['x-backend-pass'];
    if (backendPass && backendPass === options.secret) {
      request.isInternal = true;
      return;
    }
    const apiKey = request.headers['x-api-key'] as string;
    if (!apiKey) {
      return reply.code(401).send({ error: 'Unauthorized Access: Backend Pass or API Key required' });
    }
    try {
      const res = await fetch("https://database-service:5000/user/verify-apikey", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          'x-backend-pass': options.secret 
        },
        body: JSON.stringify({ apiKey })
      });
      const data = await res.json() as any;
      if (!res.ok || !data.user)
        return reply.code(401).send({ error: 'Invalid API Key' });
      request.apiUser = data.user; 
    } catch (err) {
      server.log.error(err);
      return reply.code(500).send({ error: 'Error verifying the API Key' });
    }
  });
}

declare module 'fastify' {
  interface FastifyInstance {
    requireBackendPass: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireKey: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    userPseudo?: { pseudo: string };
    isInternal?: boolean;
    apiUser?: any;
  }
}

export default fp(backendGuardPlugin);