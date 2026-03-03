import { FastifyInstance } from 'fastify';
import { prisma } from '../../prisma';
import { findUserByPseudo } from '../utils/utils_user';

export default async function friendRoutes(server: FastifyInstance) {
  
  server.get('/friend/list', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const userId = request.user.pseudo;
    
    const friendships = await prisma.friend.findMany({
        where: {
          OR : [ 
          { requesterId: userId, status: 'ACCEPTED'}, 
          { addresseeId: userId, status: 'ACCEPTED'}
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
      const friend = relation.requesterId === userId ? relation.addressee : relation.requester;
      return {
        pseudo: friend.pseudo,
        isOnline: onlinePseudos.includes(friend.pseudo)
      };
    });

    return { success: true, friends: formattedFriends };
  });

  server.get('/friend/receive', {
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
          requesterId: friendPseudo, addresseeId: myPseudo
        }
      });
      if (friendRequest) {
        if (friendRequest.status === "PENDING") {
          const FriendAccept = await prisma.friend.updateMany({
            where: { OR : [ 
              { requesterId: friendPseudo, addresseeId: myPseudo }, 
              { requesterId: myPseudo, addresseeId: friendPseudo}
            ]},
            data : { status : "ACCEPTED" }
          });
          if (server.sendToUser) {
            server.sendToUser(friendPseudo, { type: 'friend_request_accepted', friend: myPseudo });
            server.sendToUser(myPseudo, { type: 'friend_status_change', pseudo: friendPseudo, status: 'online' });
          }
          return { success: true, message: "Reverse friend request send, accepted", data: FriendAccept };
        }
        if (friendRequest.status === "ACCEPTED")
         return reply.code(402).send({ error: "Request is already accepted..." });
      } 
      else {
        if (await prisma.friend.findFirst({ where: {requesterId: myPseudo, addresseeId: friendPseudo}}))
          return reply.code(400).send({ error: "Friend request already sent" });
        const newFriendRequest = await prisma.friend.create({ data: { requesterId: myPseudo, addresseeId: friendPseudo }});
        if (server.sendToUser) {
          server.sendToUser(friendPseudo, { type: 'new_friend_request', from: myPseudo });
        }
        return { success: true, message: "Friend Request send succefuly", data: newFriendRequest }
      }
    } catch (error) {
      server.log.error(error);
      return reply.code(500).send({ error: "Server Error" });
    }
  });

  server.post('/friend/accept', {
    onRequest: [server.authenticate]
  }, async (request, reply) => { 
    const { friendPseudo } = request.body as { friendPseudo: string };
    const myPseudo = request.user.pseudo;

    try {
      const friend = await findUserByPseudo(friendPseudo);
      if (!friend)
        return reply.code(400).send({ error: "This account doesn't exists" });
        
      const FriendAccept = await prisma.friend.updateMany({
          where: { OR : [ 
            { requesterId: friendPseudo, addresseeId: myPseudo }, 
            { requesterId: myPseudo, addresseeId: friendPseudo}
          ]},
          data : { status : "ACCEPTED" }
      });
      
      if (!FriendAccept)
        return reply.code(403).send({ error: "Anormal Error..." });

      if (server.sendToUser) {
        server.sendToUser(friendPseudo, { type: 'friend_request_accepted', friend: myPseudo });
        server.sendToUser(myPseudo, { type: 'friend_status_change', pseudo: friendPseudo, status: 'online' });
      }

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
    const myPseudo = request.user.pseudo;

    try {
      const friend = await findUserByPseudo(friendPseudo);
      if (!friend)
        return reply.code(400).send({ error: "This account doesn't exists" });
        
      await prisma.friend.deleteMany({
          where: { OR : [ 
            { requesterId: friendPseudo, addresseeId: myPseudo }, 
            { requesterId: myPseudo, addresseeId: friendPseudo}
          ]} 
      });

      if (server.sendToUser) {
        server.sendToUser(friendPseudo, { type: 'friend_request_refused', friend: myPseudo });
      }

      return { success: true, message: "Friend request refused"};
    }
    catch (error) {
      server.log.error(error);
      return reply.code(500).send({ error: "Server Error" });
    }
  });
}