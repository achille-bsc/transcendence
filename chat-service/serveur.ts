import fastify from 'fastify';
import authGuardPlugin from '../../shared/plugin/authGuard';
import messageRoutes from '../../chat-service/messages';
import websocketPlugin from './plugins/websocket';

const server = fastify({ logger: true });

await server.register(authPlugin);
await server.register(websocketPlugin);
await server.register(setupStaticFiles);
await server.register(friendRoutes);
await server.register(authRoutes);
await server.register(userRoutes);
await server.register(healthRoutes);
await server.register(messageRoutes);
await server.register(inviteRoutes);

server.listen({ port: 5000, 
  host: '0.0.0.0', }, (err, address) => {
  console.log("Starting server...");
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

