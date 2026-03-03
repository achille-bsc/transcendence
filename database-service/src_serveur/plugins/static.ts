import fastifyStatic from '@fastify/static';
import path from 'path';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

async function setupStaticFiles(server: FastifyInstance) {
  server.register(fastifyStatic, {
    root: '/app/uploads',
    prefix: '/public/',
  });
}

export default fp(setupStaticFiles);