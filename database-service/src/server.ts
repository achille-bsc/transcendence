import fastify from 'fastify';
import authRoutes from './routes/authRoutes';
import friendRoutes from './routes/friendRoutes';
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import healthRoutes from './routes/health';
import fs from 'fs';
import backendGuardPlugin from '../plugins/backendGuard';
import fastifyRateLimit from '@fastify/rate-limit';
import { prisma } from '../prisma';
import publicRoutes from './routes/publicRoutes';

async function start() {
  const server = fastify({ 
    logger: true,
    https: {
      key: fs.readFileSync('/app/certs/private/db.key'),
      cert: fs.readFileSync('/app/certs/public/db.crt')
    }
  });

  try {
    const apiPass = fs.readFileSync('/run/secrets/api_pass', 'utf-8').trim();
    await server.register(backendGuardPlugin, { secret: apiPass });
    await server.register(fastifyRateLimit, {
      global: false,
      max: 3,
      timeWindow: '1 minute',
      errorResponseBuilder: function (request, context) {
        return {
          code: 429,
          error: 'Too Many Requests',
          message: `Rate limit reached. You can only make ${context.max} requests every ${context.after}.`
        };
      }
    });
    server.decorate('authenticateApiKey', async (request, reply) => {
      const apiKey = request.headers['x-api-key'];
      if (!apiKey || typeof apiKey !== 'string') {
        return reply.code(401).send({ error: "Missing 'x-api-key' header" });
      }
      const user = await prisma.user.findFirst({where: { apiKey: apiKey }});
      if (!user) {
        return reply.code(401).send({ error: "Invalid API Key" });
      }
      (request as any).userPseudo = { pseudo: user.pseudo }; 
    });

    await server.register(publicRoutes);
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
