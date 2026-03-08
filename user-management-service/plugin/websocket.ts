import { FastifyInstance, FastifyRequest } from 'fastify';
import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';
import { WebSocket } from 'ws';


export const clients = new Map<string, Set<WebSocket>>();

async function verifyToken(token: string): Promise<{ pseudo: string } | null> {
  try {
    const res = await fetch(`/api/auth/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.pseudo ? { pseudo: data.pseudo } : null;
  } catch {
    return null;
  }
}

async function friendWebsocketPlugin(server: FastifyInstance) {
  await server.register(websocket, {
    options: { maxPayload: 1048576 },
  });

  server.get('/ws', { websocket: true }, async (socket, req: FastifyRequest) => {
    try {
      const token = (req.query as { token?: string }).token;
      if (!token) {
        socket.close(1008, 'Token required');
        return;
      }

      const user = await verifyToken(token);
      if (!user) {
        socket.close(1008, 'Invalid token');
        return;
      }
      const pseudo = user.pseudo;
      if (!clients.has(pseudo))
        clients.set(pseudo, new Set());
      clients.get(pseudo)!.add(socket);

      socket.send(JSON.stringify({
        type: 'connected',
        pseudo,
        timestamp: new Date().toISOString(),
      }));

      socket.on('message', async (data: Buffer) => {
        let message: any;
        try {
          message = JSON.parse(data.toString());
        } catch {
          socket.send(JSON.stringify({ type: 'error', message: 'Invalid JSON format' }));
          return;
        }

        switch (message.type) {
          case 'ping':
            socket.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
            break;
          case 'GET_ONLINE_USERS':
            socket.send(JSON.stringify({
              type: 'ONLINE_USERS',
              data: getOnlineUsers(),
            }));
            break;
          default:
            server.log.warn(`Unknown friend WS message type: ${message.type}`);
        }
      });

      socket.on('close', () => {
        const userSockets = clients.get(pseudo);
        if (userSockets) {
          userSockets.delete(socket);
          if (userSockets.size === 0) {
            clients.delete(pseudo);
          }
        }
      });

      socket.on('error', () => {
        const userSockets = clients.get(pseudo);
        userSockets?.delete(socket);
        if (userSockets?.size === 0) {
          clients.delete(pseudo);
        }
      });

    } catch {
      socket.close(1008, 'Invalid token');
    }
  });

  // Décorer le serveur pour que les routes friend puissent envoyer des events WS
  server.decorate('sendToUser', sendToUser);
  server.decorate('sendToUsers', sendToUsers);
  server.decorate('sendToAll', sendToAll);
  server.decorate('getOnlineUsers', getOnlineUsers);
}

function sendToUser(pseudo: string, message: any): boolean {
  const sockets = clients.get(pseudo);
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

function sendToUsers(pseudos: string[], message: any): number {
  let totalSent = 0;
  pseudos.forEach(p => {
    if (sendToUser(p, message)) totalSent++;
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

function getOnlineUsers(): string[] {
  return Array.from(clients.keys());
}

declare module 'fastify' {
  interface FastifyInstance {
    sendToUser(pseudo: string, message: any): boolean;
    sendToUsers(pseudos: string[], message: any): number;
    sendToAll(message: any): number;
    getOnlineUsers(): string[];
  }
}

export default fp(friendWebsocketPlugin, { name: 'friend-websocket-plugin' });