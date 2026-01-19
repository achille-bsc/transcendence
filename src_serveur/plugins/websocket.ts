import { FastifyInstance } from 'fastify';
import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';

async function websocketPlugin(server: FastifyInstance) {
  await server.register(websocket);
}

export default fp(websocketPlugin);