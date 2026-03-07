import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';
import fs from 'fs';

async function localAuthPlugin(server: FastifyInstance) {
  try {
    await server.register(fastifyJwt, {
      secret: fs.readFileSync('/run/secrets/jwt_secret', 'utf-8').trim(),
      sign: { expiresIn: '7d', algorithm: 'HS256' }, 
      verify: { algorithms: ['HS256'] }
    });
  } catch (error) {
    console.error("Error occurred while registering JWT plugin:", error);
    process.exit(1);
  }

  server.get('/validate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const decodedToken = await request.jwtVerify(); 
      return reply.code(200).send(decodedToken);
    } catch (err) {
      return reply.code(401).send({ error: 'Token invalide ou expiré' });
    }
  });

  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Invalid Token' });
    }
  });
}

export default fp(localAuthPlugin);