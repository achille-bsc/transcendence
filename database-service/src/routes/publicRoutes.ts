import { FastifyInstance } from 'fastify';
import { prisma } from '../../prisma';

export default async function publicRoutes(server: FastifyInstance) {
  
  const publicConfig = {
    onRequest: [(server as any).authenticateApiKey] 
  };
  server.get('/api/public/friends/receive', publicConfig, async (request, reply) => {
    const myPseudo = (request as any).userPseudo.pseudo;
    const friendRequests = await prisma.friend.findMany({
      where: { addresseeId: myPseudo, status: 'PENDING' },
      include: { requester: { select: { pseudo: true } } }
    });
    return { success: true, data: friendRequests };
  });
  server.get('/api/public/friends', publicConfig, async (request, reply) => {
    const myPseudo = (request as any).userPseudo.pseudo;
    const friendships = await prisma.friend.findMany({
      where: {
        OR: [
          { requesterId: myPseudo, status: 'ACCEPTED' },
          { addresseeId: myPseudo, status: 'ACCEPTED' }
        ]
      },
      include: {
        requester: { select: { pseudo: true } },
        addressee: { select: { pseudo: true } }
      }
    });
    const formattedFriends = friendships.map((relation: typeof friendships[number]) => {
      const friend = relation.requesterId === myPseudo ? relation.addressee : relation.requester;
      return { pseudo: friend.pseudo };
    });
    
    return { success: true, data: formattedFriends };
  });
  server.post('/api/public/user/exists', publicConfig, async (request, reply) => {
    const { pseudo } = request.body as { pseudo: string };
    if (!pseudo) {
      return reply.code(400).send({ error: "Pseudo is required in the body" });
    }
    const user = await prisma.user.findUnique({
      where: { pseudo: pseudo }
    });
    if (user) {
      return { success: true, exists: true };
    } else {
      return reply.code(404).send({ success: false, exists: false, message: "User not found" });
    }
  });
  server.put('/api/public/user/email', publicConfig, async (request, reply) => {
    const myPseudo = (request as any).userPseudo.pseudo;
    const { email } = request.body as { email: string };
    
    if (!email || !email.includes('@') || !email.includes('.')) {
      return reply.code(400).send({ error: "Invalid email format" });
    }
    try {
      await prisma.user.update({
        where: { pseudo: myPseudo },
        data: { email: email }
      });
      return { success: true, message: "Email updated successfully" };
    } catch (error) {
      return reply.code(400).send({ error: "Email might already be in use" });
    }
  });
  server.delete('/api/public/user', publicConfig, async (request, reply) => {
    const myPseudo = (request as any).userPseudo.pseudo;
    try {
      await prisma.user.delete({
        where: { pseudo: myPseudo }
      });
      return { success: true, message: "Account deleted successfully" };
    } catch (error) {
      server.log.error(error);
      return reply.code(500).send({ error: "Could not delete account" });
    }
  });
}