import fastifyStatic from '@fastify/static';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function setupStaticFiles(server: FastifyInstance) {
  server.register(fastifyStatic, {
    root: '/app/avatars',
    prefix: '/public/',
  });
}

export default fp(setupStaticFiles);