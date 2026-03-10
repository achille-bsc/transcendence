import fastifyStatic from '@fastify/static';
import path from 'path';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

async function setupStaticFiles(server: FastifyInstance) {
  server.register(fastifyStatic, {
    root: '/app/default_avatars',
    prefix: '/public/',
  });
}

export default fp(setupStaticFiles);