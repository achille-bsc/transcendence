import fastify from 'fastify';
import authGuardPlugin from '../plugin/authGuard';
import messageRoutes from './messages';
import chatWebsocketPlugin from './websocket';
import fs from 'fs';

async function start() {
  const server = fastify({ 
    logger: true,
    https: {
      key: fs.readFileSync('/app/certs/private/srv.key'),
      cert: fs.readFileSync('/app/certs/public/srv.crt')
    }
  });

  try {
    await server.register(authGuardPlugin);
    await server.register(chatWebsocketPlugin);
    await server.register(messageRoutes);

    server.listen({ port: 3004, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
      console.log(`Chat service listening at ${address}`);
    });
  } catch (error) {
    console.error('Critical Error starting chat-service:', error);
    process.exit(1);
  }
}

start();