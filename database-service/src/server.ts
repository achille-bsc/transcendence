import fastify from 'fastify';
import authRoutes from './routes/authRoutes';
import friendRoutes from './routes/friendRoutes';
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import healthRoutes from './routes/health';
import setupStaticFiles from '../plugins/static';
import fs from 'fs';
import backendGuardPlugin from '../plugins/backendGuard';

async function start() {
  const server = fastify({ logger: true });

  try {
    const apiPass = fs.readFileSync('/run/secrets/api_pass', 'utf-8').trim();
    await server.register(backendGuardPlugin, { secret: apiPass });
    await server.register(setupStaticFiles);

    await server.register(chatRoutes);
    await server.register(friendRoutes);
    await server.register(healthRoutes);
    await server.register(authRoutes);
    await server.register(userRoutes);
    server.listen({ port: 5000, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  }
  catch (error) {
    console.error("Critical Error : Impossible to read the Docker secret", error);
    process.exit(1);
  }
}
start();
