import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import fp from 'fastify-plugin';

async function corsPlugin(server: FastifyInstance) {
  await server.register(cors, {
    origin: true,
  });
}

export default fp(corsPlugin);