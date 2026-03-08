import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../prisma';

export default async function friendRoutes(server: FastifyInstance) {
    server.get('/friend', { onRequest: [server.requireBackendPass]}, 
    async (request, reply) => {
    const friendships = await prisma.friend.findMany({
        where: {
          OR : [ 
          { requesterId: request.userPseudo?.pseudo, status: 'ACCEPTED'}, 
          { addresseeId: request.userPseudo?.pseudo, status: 'ACCEPTED'}
        ] },
        include: {
            requester: { select: {pseudo: true} },
            addressee: { select: {pseudo: true} }
        }
    });
    if (!friendships)
      return reply.code(411).send({ error: 'No friends found' });
    const formattedFriends = friendships.map((relation: typeof friendships[number]) => {
      const friend = relation.requesterId === request.userPseudo?.pseudo 
        ? relation.addressee : relation.requester;
      return { pseudo: friend.pseudo };
    });
    return formattedFriends;});

    server.get('/friend/receive', { onRequest: [server.requireBackendPass]}, 
    async (request, reply) => {
    const friendSend = await prisma.friend.findMany({
        where: {
           addresseeId: request.userPseudo?.pseudo, status: 'PENDING', },
        include: {
            requester: { select: {pseudo: true} },
          }
      });
    return { success: true, friends: friendSend }});    

    server.post('/friend/send', {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { myPseudo, friendPseudo } = request.body as { myPseudo: string; friendPseudo: string };
    
    const reverseRequest = await prisma.friend.findFirst({
      where: { requesterId: friendPseudo, addresseeId: myPseudo }
    });
    if (reverseRequest) {
      if (reverseRequest.status === 'PENDING') {
        const accepted = await prisma.friend.updateMany({
          where: { OR: [
            { requesterId: friendPseudo, addresseeId: myPseudo },
            { requesterId: myPseudo, addresseeId: friendPseudo }
          ]},
          data: { status: 'ACCEPTED' }
        });
        return { success: true, action: 'auto_accepted', data: accepted };
      }
      if (reverseRequest.status === 'ACCEPTED')
        return reply.code(400).send({ error: 'Already friends' });
    }
    
    const existing = await prisma.friend.findFirst({
      where: { requesterId: myPseudo, addresseeId: friendPseudo }
    });
    if (existing)
      return reply.code(400).send({ error: 'Friend request already sent' });

    const newRequest = await prisma.friend.create({
      data: { requesterId: myPseudo, addresseeId: friendPseudo }
    });
    return { success: true, action: 'sent', data: newRequest };
  });

  server.post('/friend/accept', {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { myPseudo, friendPseudo } = request.body as { myPseudo: string; friendPseudo: string };
    const result = await prisma.friend.updateMany({
      where: { OR: [
        { requesterId: friendPseudo, addresseeId: myPseudo },
        { requesterId: myPseudo, addresseeId: friendPseudo }
      ]},
      data: { status: 'ACCEPTED' }
    });
    if (!result.count)
      return reply.code(404).send({ error: 'No friend request found' });
    return { success: true, data: result };
  });

  server.post('/friend/remove', {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { myPseudo, friendPseudo } = request.body as { myPseudo: string; friendPseudo: string };
    await prisma.friend.deleteMany({
    where: { OR: [
      { requesterId: friendPseudo, addresseeId: myPseudo, status: 'ACCEPTED' },
      { requesterId: myPseudo, addresseeId: friendPseudo, status: 'ACCEPTED' }
    ]}
  });
    return { success: true };
  });

  server.post('/friend/refuse', {
    onRequest: [server.requireBackendPass]
  }, async (request, reply) => {
    const { myPseudo, friendPseudo } = request.body as { myPseudo: string; friendPseudo: string };
    await prisma.friend.deleteMany({
      where: {
        requesterId: friendPseudo, addresseeId: myPseudo, status: 'PENDING'
      }
    });
    return { success: true };
  });
};