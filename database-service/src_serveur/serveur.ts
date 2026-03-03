import fastify from 'fastify';
import corsPlugin from './plugins/cors';
import authPlugin from './plugins/tokens';
import authRoutes from './routes/register';
import userRoutes from './routes/user';
import friendRoutes from './routes/friend';
import inviteRoutes from './routes/invite';
import healthRoutes from './routes/health';
import messageRoutes from './routes/messages';
import websocketPlugin from './plugins/websocket';
import setupStaticFiles from './plugins/static';
const server = fastify({ logger: true });

await server.register(corsPlugin);
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

