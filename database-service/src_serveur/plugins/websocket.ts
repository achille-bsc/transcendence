import { FastifyInstance, FastifyRequest } from 'fastify';
import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';
import { WebSocket } from 'ws';

export const clients = new Map<number, Set<WebSocket>>();

async function websocketPlugin(server: FastifyInstance) {
  await server.register(websocket, {
    options: {
      maxPayload: 1048576,
    },
  });

  server.get('/ws', { websocket: true }, (connection, req: FastifyRequest) => {
    const socket = connection.socket;
    const userIdStr = req.headers['user-id'] as string;

    if (!userIdStr) {
      socket.close(1008, 'user-id header required');
      return;
    }

    const userId = parseInt(userIdStr);
    if (isNaN(userId)) {
      socket.close(1008, 'Invalid user-id');
      return;
    }

    if (!clients.has(userId)) {
      clients.set(userId, new Set());
    }
    clients.get(userId)!.add(socket);

    socket.send(JSON.stringify({
      type: 'connected',
      userId,
      timestamp: new Date().toISOString(),
    }));

    socket.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        handleClientMessage(server, userId, socket, message);
      } catch (error) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Invalid JSON format',
        }));
      }
    });

    socket.on('close', () => {
      const userSockets = clients.get(userId);
      if (userSockets) {
        userSockets.delete(socket);
        if (userSockets.size === 0) {
          clients.delete(userId);
        }
      }
    });

    socket.on('error', () => {
      const userSockets = clients.get(userId);
      userSockets?.delete(socket);
      if (userSockets?.size === 0) clients.delete(userId);
    });
  });

  server.decorate('sendToUser', sendToUser);
  server.decorate('sendToUsers', sendToUsers);
  server.decorate('sendToAll', sendToAll);
  server.decorate('getOnlineUsers', getOnlineUsers);
}


function handleClientMessage(
  server: FastifyInstance,
  userId: number,
  socket: WebSocket,
  message: any
) {
  switch (message.type) {
    case 'ping':
      socket.send(JSON.stringify({
        type: 'pong',
        timestamp: new Date().toISOString(),
      }));
      break;
    default:
      server.log.warn(`Unknown message type: ${message.type}`);
  }
}

function sendToUser(userId: number, message: any): boolean {
  const sockets = clients.get(userId);
  if (!sockets || sockets.size === 0) return false;

  const messageStr = JSON.stringify(message);
  let sent = 0;
  
  sockets.forEach(socket => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(messageStr);
      sent++;
    }
  });
  return sent > 0;
}

function sendToUsers(userIds: number[], message: any): number {
  let totalSent = 0;
  userIds.forEach(id => {
    if (sendToUser(id, message)) totalSent++;
  });
  return totalSent;
}

function sendToAll(message: any): number {
  const messageStr = JSON.stringify(message);
  let totalSent = 0;
  
  clients.forEach((sockets) => {
    sockets.forEach(socket => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(messageStr);
        totalSent++;
      }
    });
  });
  
  return totalSent;
}

function getOnlineUsers(): number[] {
  return Array.from(clients.keys());
}

declare module 'fastify' {
  interface FastifyInstance {
    sendToUser(userId: number, message: any): boolean;
    sendToUsers(userIds: number[], message: any): number;
    sendToAll(message: any): number;
    getOnlineUsers(): number[];
  }
}

export default fp(websocketPlugin, {
  name: 'websocket-plugin',
});