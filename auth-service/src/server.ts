import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import localAuthPlugin from './routes/tokens'; // Chemin vers le Fichier 1
import authRoutes from './routes/register'; // Chemin vers le Fichier 2
import fs from 'fs';

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
  const server = fastify({ 
    logger: true,
    https: {
      key: fs.readFileSync('/app/certs/srv.key'),
      cert: fs.readFileSync('/app/certs/srv.crt')
    }
  });

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