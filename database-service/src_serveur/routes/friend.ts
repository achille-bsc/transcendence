import { FastifyInstance } from 'fastify';
import { prisma } from '../../prisma'; // Adapte le chemin vers ton instance prisma

export default async function friendRoutes(server: FastifyInstance) {
  
  server.get('/friends', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const userId = request.user.id;
    try {
      const friendships = await prisma.friend.findMany({
        where: {
          userId: userId,
          status: 'ACCEPTED',
        },
        include: {
          friend: {
            select: {
              id: true,
              pseudo: true,
              email: true,
            }
          }
        }
      });
      const formattedFriends = friendships.map(relation => relation.friend);
      return { success: true, friends: formattedFriends };
    } catch (error) {
      server.log.error(error);
      return reply.code(400).send({ error: 'Error when search all friend' });
    }
  });
}