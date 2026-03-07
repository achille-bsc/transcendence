import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import authGuardPlugin from '../plugins/authGuard';

async function start() {
  const server = fastify({ logger: true });
  
  await server.register(authGuardPlugin);

  server.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

start();