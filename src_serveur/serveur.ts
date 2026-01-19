import fastify from 'fastify';
import corsPlugin from './plugins/cors';
import authPlugin from './plugins/tokens';
import authRoutes from './routes/register';
import userRoutes from './routes/user';
import healthRoutes from './routes/health';
//import messageRoutes from './routes/messages';

const server = fastify({ logger: true });

// Plugins
await server.register(corsPlugin);
await server.register(authPlugin);

// Routes
await server.register(authRoutes);
await server.register(userRoutes);
await server.register(healthRoutes);
//await server.register(messageRoutes);

// Start server
server.listen({ port: 7979 }, (err, address) => {
  console.log("Starting server...");
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

