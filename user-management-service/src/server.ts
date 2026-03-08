import fastify from 'fastify';
import multipart from '@fastify/multipart';
import authGuardPlugin from '../plugin/authGuard';  // 'plugin' pas 'plugins'
import friendRoutes from './routes/friend';
import userRoutes from './routes/user';

async function start() {
  const server = fastify({ logger: true });

  try {
    await server.register(authGuardPlugin);
    await server.register(multipart);
    await server.register(friendRoutes);
    await server.register(userRoutes);

    server.listen({ port: 3003, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
      console.log(`User-management service listening at ${address}`);
    });
  } catch (error) {
    console.error('Critical Error starting user-management-service:', error);
    process.exit(1);
  }
}

start();