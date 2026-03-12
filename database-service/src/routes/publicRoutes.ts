import { FastifyInstance } from 'fastify';
import { prisma } from '../../prisma';
import fastifyRateLimit from '@fastify/rate-limit';

export default async function publicRoutes(server: FastifyInstance) {
  
  await server.register(fastifyRateLimit, {
    global: true, 
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
    
    if (!email || email.trim() === '') {
      return reply.code(408).send({ error: "The new email is required" });
    }
    else if (!email || email.length === 0 || email.includes(' ') ||
        email.split('@').length !== 2 || !email.includes('.'))
    {
        return reply.code(408).send({ error: "Enter a valid email address" })
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

  server.post('/api/public/friends/send', publicConfig, async (request, reply) => {
    const myPseudo = (request as any).userPseudo.pseudo;
    const { friendPseudo } = request.body as { friendPseudo?: string };
    if (!friendPseudo) {
      return reply.code(400).send({ error: "friendPseudo is required in the body" });
    }
    if (myPseudo === friendPseudo) {
      return reply.code(400).send({ error: "You can't add yourself" });
    }
    const targetUser = await prisma.user.findUnique({
      where: { pseudo: friendPseudo }
    });
    if (!targetUser) {
      return reply.code(404).send({ error: "This account doesn't exist" });
    }
    const reverseRequest = await prisma.friend.findFirst({
      where: { requesterId: friendPseudo, addresseeId: myPseudo }
    });
    if (reverseRequest) {
      if (reverseRequest.status === 'PENDING') {
        await prisma.friend.updateMany({
          where: { OR: [
            { requesterId: friendPseudo, addresseeId: myPseudo },
            { requesterId: myPseudo, addresseeId: friendPseudo }
          ]},
          data: { status: 'ACCEPTED' }
        });
        return { success: true, action: 'auto_accepted', message: "Friend request auto-accepted" };
      }
      if (reverseRequest.status === 'ACCEPTED') {
        return reply.code(400).send({ error: 'Already friends' });
      }
    }
    const existing = await prisma.friend.findFirst({
      where: { requesterId: myPseudo, addresseeId: friendPseudo }
    });

    if (existing) {
      return reply.code(400).send({ error: 'Friend request already sent' });
    }
    const newRequest = await prisma.friend.create({
      data: { requesterId: myPseudo, addresseeId: friendPseudo }
    });

    return { success: true, action: 'sent', message: "Friend request sent successfully" };
  });
}