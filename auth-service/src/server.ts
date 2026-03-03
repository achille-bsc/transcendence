import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import localAuthPlugin from './plugins/tokens'; // Chemin vers le Fichier 1
import authRoutes from './routes/auth'; // Chemin vers le Fichier 2

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: { pseudo: string }
  }
}

async function start() {
  const server = fastify({ logger: true });

  await server.register(localAuthPlugin);
  
  await server.register(authRoutes);

  server.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

start();