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
};