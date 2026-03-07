import { FastifyInstance } from 'fastify';
import { prisma } from '../../database-service/prisma';
import { findUserByPseudo } from '../../auth-service/utils/utils_user';
import fs from 'fs';

try {
  fs.accessSync('/run/secrets/api_pass', fs.constants.R_OK);
} catch (err) {
  console.error("Error: Unable to read API password from /run/secrets/api_pass. Please ensure the file exists and has the correct permissions.");
  process.exit(1);
}
const api_pass = fs.readFileSync('/run/secrets/api_pass', 'utf-8').trim();

export default async function friendRoutes(server: FastifyInstance) {
  
  server.get('/friend', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const res = await fetch("/api/db/friend", {
			method: "GET",
			headers: {
        'x-backend-pass': api_pass
			},
			});
    const data = await res.json();
    if (!res.ok)
      return reply.code(400).send({ error: data.error }); 
    return { success: true, friends: data };
  });

  server.get('/friend/receive', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const res = await fetch("/api/db/friend/receive", {
			method: "GET",
			headers: {
        'x-backend-pass': api_pass
			}});
    const data = await res.json();
    if (!res.ok)
      return reply.code(400).send({ error: data.error }); 
    return { success: true, friends: data };
  });

  server.post('/friend/send', {
    onRequest: [server.authenticate]
  }, async (request, reply) => { 
    const { friendPseudo } = request.body as { friendPseudo: string };
    const myPseudo = request.user.pseudo;
    if (myPseudo === friendPseudo)
      return reply.code(400).send({ error: "You can't add youself" });
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