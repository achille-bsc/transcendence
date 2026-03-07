import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../prisma';

export default async function authRoutes(server: FastifyInstance) {
    server.get('/friend', { onRequest: [server.requireBackendPass]}, 
    async (request, reply) => {
    const friendships = await prisma.friend.findMany({
        where: {
          OR : [ 
          { requesterId: request.userPseudo, status: 'ACCEPTED'}, 
          { addresseeId: request.userPseudo, status: 'ACCEPTED'}
        ] },
        include: {
            requester: { select: {pseudo: true} },
            addressee: { select: {pseudo: true} }
        }
    });
    if (!friendships)
      return reply.code(411).send({ error: 'No friends found' });
    const onlinePseudos = server.getOnlineUsers ? server.getOnlineUsers() : [];
    const formattedFriends = friendships.map(relation => {
      const friend = relation.requesterId === request.userPseudo ? relation.addressee : relation.requester;
      return {
        pseudo: friend.pseudo,
        isOnline: onlinePseudos.includes(friend.pseudo)
      };
    });
    return formattedFriends;});

    server.get('/friend/receive', { onRequest: [server.requireBackendPass]}, 
    async (request, reply) => {
    const friendSend = await prisma.friend.findMany({
        where: {
           addresseeId: request.userPseudo, status: 'PENDING', },
        include: {
            requester: { select: {pseudo: true} },
          }
      });
    return { success: true, friends: friendSend }});    
};