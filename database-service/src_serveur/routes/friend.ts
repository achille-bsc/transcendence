import { FastifyInstance } from 'fastify';
import { prisma } from '../../prisma'; // Adapte le chemin vers ton instance prisma
import { findUserByPseudo } from '../utils/utils_user';

export default async function friendRoutes(server: FastifyInstance) {
  
  server.post('/friend/list', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const userId = request.user.pseudo;
    const friendships = await prisma.friend.findMany({
        where: {
          OR : [ 
          { requesterId: request.user.pseudo, status: 'ACCEPTED'}, 
          { addresseeId: request.user.pseudo, status: 'ACCEPTED',}
        ] },
        include: {
            requester: { select: {pseudo: true} },
            addressee: { select: {pseudo: true} }
        }
      });
      if (!friendships) {
        return reply.code(411).send({ error: 'No friends found' });
      }
      const formattedFriends = friendships.map(relation => 
         relation.requesterId === userId ? relation.addressee : relation.requester);
      return { success: true, friends: formattedFriends };
});

  server.post('/friend/receive', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    try {
      const friendSend = await prisma.friend.findMany({
        where: {
           addresseeId: request.user.pseudo, status: 'PENDING', },
        include: {
            requester: { select: {pseudo: true} },
          }
      });
      return { success: true, friends: friendSend };
    }
    catch (error) {
      server.log.error(error);
      return reply.code(400).send({ error: 'Error when search all friend' });
    }
  });

  server.post('/friend/send', {
    onRequest: [server.authenticate]
  }, async (request, reply) => { 
  const { friendPseudo } = request.body as { friendPseudo: string };
  const myPseudo = request.user.pseudo;
  if (myPseudo === friendPseudo)
    return reply.code(400).send({ error: "You can't add you" });

  try {
    const friend = await findUserByPseudo(friendPseudo);
    if (!friend)
      return reply.code(400).send({ error: "This account doesn't exists" });
    let friendRequest = await prisma.friend.findFirst({
    where: {
         requesterId: request.user.pseudo, addresseeId: friend.pseudo
        }})
    if (friendRequest)
    {
      if (friendRequest.status === "PENDING")
       return reply.code(402).send({ error: "Request is already pending..." });
      if (friendRequest.status === "ACCEPTED")
       return reply.code(402).send({ error: "Request is already accepted..." });
      friendRequest = await prisma.friend.findFirst({ where: { requesterId: friendPseudo, addresseeId: request.user.pseudo }})
      const FriendAccept = await prisma.friend.updateFirst({
        where: { OR : [ {
         requesterId: friendPseudo, addresseeId: request.user.pseudo }, 
         { requesterId: request.user.pseudo, addresseeId: friendPseudo}] },
        data : { status : "ACCEPTED" }})
      return { success: true, message: "Reverse friend request send, accepted", data: FriendAccept };
    }
    else {
      const newFriendRequest = await prisma.friend.create({ data: { requesterId: request.user.pseudo, addresseeId: friendPseudo }});
      return { success: true, message: "Friend Request send succefuly", data: newFriendRequest }
    }
  } catch (error) {
    server.log.error(error);
    return reply.code(500).send({ error: "Server Error" });
  }
  });

  server.post('/friend/accepte', {
    onRequest: [server.authenticate]
  }, async (request, reply) => { 
  const { friendPseudo } = request.body as { friendPseudo: string };
  try {
    const friend = await findUserByPseudo(friendPseudo);
    if (!friend)
      return reply.code(400).send({ error: "This account doesn't exists" });
    const FriendAccept = await prisma.friend.updateMany({
        where: { OR : [ {
         requesterId: friendPseudo, addresseeId: request.user.pseudo }, 
         { requesterId: request.user.pseudo, addresseeId: friendPseudo}] },
        data : { status : "ACCEPTED" }})
    if (!FriendAccept)
      return reply.code(403).send({ error: "Anormal Error..." });
    return { success: true, message: "Friend request accepted", data: FriendAccept };
  }
  catch (error) {
    server.log.error(error);
    return reply.code(500).send({ error: "Server Error" });
  }
  });

  server.post('/friend/refuse', {
    onRequest: [server.authenticate]
  }, async (request, reply) => { 
  const { friendPseudo } = request.body as { friendPseudo: string };
  try {
    const friend = await findUserByPseudo(friendPseudo);
    if (!friend)
      return reply.code(400).send({ error: "This account doesn't exists" });
    await prisma.friend.deleteMany({
        where: { OR : [ {
         requesterId: friendPseudo, addresseeId: request.user.pseudo }, 
         { requesterId: request.user.pseudo, addresseeId: friendPseudo}] } })
    return { success: true, message: "Friend request refused"};
  }
  catch (error) {
    server.log.error(error);
    return reply.code(500).send({ error: "Server Error" });
  }
  });
}