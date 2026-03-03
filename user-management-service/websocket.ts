import { FastifyInstance, FastifyRequest } from 'fastify';
import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';
import { prisma } from '../../prisma';
import { WebSocket } from 'ws';

export const clients = new Map<string, Set<WebSocket>>();

async function websocketPlugin(server: FastifyInstance) {
  await server.register(websocket, {
    options: { maxPayload: 1048576 },
  });

  async function notifyFriendsStatus(pseudo: string, status: 'online' | 'offline') {
    try {
      const friendships = await prisma.friend.findMany({
        where: {
          OR: [{ requesterId: pseudo }, { addresseeId: pseudo }],
          status: 'ACCEPTED'
        }
      });

      const friendPseudos = friendships.map(f => 
        f.requesterId === pseudo ? f.addresseeId : f.requesterId
      );

      server.sendToUsers(friendPseudos, {
        type: 'friend_status_change',
        pseudo: pseudo,
        status: status,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      server.log.error(err);
    }
  }

  server.get('/ws', { websocket: true }, async (connection, req: FastifyRequest) => {
    const socket = connection.socket;
    
    try {
      const token = (req.query as { token?: string }).token;
      if (!token) {
        socket.close(1008, 'Token required');
        return;
      }

      const decoded = server.jwt.verify<{ pseudo: string }>(token);
      const pseudo = decoded.pseudo;

      if (!clients.has(pseudo)) {
        clients.set(pseudo, new Set());
        await notifyFriendsStatus(pseudo, 'online');
      }
      clients.get(pseudo)!.add(socket);

      socket.send(JSON.stringify({
        type: 'connected',
        pseudo,
        timestamp: new Date().toISOString(),
      }));

      socket.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.type === 'ping') {
            socket.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
          }
        } catch (error) {
          socket.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
        }
      });

      const handleClose = async () => {
        const userSockets = clients.get(pseudo);
        if (userSockets) {
          userSockets.delete(socket);
          if (userSockets.size === 0) {
            clients.delete(pseudo);
            await notifyFriendsStatus(pseudo, 'offline');
          }
        }
      };

      socket.on('close', handleClose);
      socket.on('error', handleClose);

    } catch (error) {
      socket.close(1008, 'Invalid token');
    }
  });

  server.decorate('sendToUser', (pseudo: string, message: any) => {
    const sockets = clients.get(pseudo);
    if (!sockets || sockets.size === 0) return false;
    const messageStr = JSON.stringify(message);
    sockets.forEach(s => { if (s.readyState === WebSocket.OPEN) s.send(messageStr); });
    return true;
  });

  server.decorate('sendToUsers', (pseudos: string[], message: any) => {
    let count = 0;
    pseudos.forEach(p => { if (server.sendToUser(p, message)) count++; });
    return count;
  });

  server.decorate('getOnlineUsers', () => Array.from(clients.keys()));
}

declare module 'fastify' {
  interface FastifyInstance {
    sendToUser(pseudo: string, message: any): boolean;
    sendToUsers(pseudos: string[], message: any): number;
    getOnlineUsers(): string[];
  }
}

export default fp(websocketPlugin, { name: 'websocket-plugin' });