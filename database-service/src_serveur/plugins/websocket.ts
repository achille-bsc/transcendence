import { FastifyInstance, FastifyRequest } from 'fastify';
import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';
import { WebSocket } from 'ws';
import { createDmConversation, newDirectMessage } from '../utils/utils_message';

export const clients = new Map<string, Set<WebSocket>>();
const MAX_DM_MESSAGE_LENGTH = 1000;

async function websocketPlugin(server: FastifyInstance) {
  await server.register(websocket, {
    options: {
      maxPayload: 1048576,
    },
  });

  server.get('/ws', { websocket: true }, async (socket, req: FastifyRequest) => {
    
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
      }
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
        } catch (error) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Invalid JSON format',
          }));
          return;
        }

        try {
          await handleClientMessage(server, pseudo, socket, message);
        } catch (error) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Internal websocket error',
          }));
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
        if (userSockets?.size === 0) clients.delete(pseudo);
      });

    } catch (error) {
      socket.close(1008, 'Invalid token');
    }
  });

  server.decorate('sendToUser', sendToUser);
  server.decorate('sendToUsers', sendToUsers);
  server.decorate('sendToAll', sendToAll);
  server.decorate('getOnlineUsers', getOnlineUsers);
}

async function handleClientMessage(
  server: FastifyInstance,
  pseudo: string,
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
    case 'SEND_DM': {
      const receiverPseudo = message?.data?.receiverPseudo;
      const content = message?.data?.content;
      const trimmedContent = typeof content === 'string' ? content.trim() : '';

      if (
        typeof receiverPseudo !== 'string' ||
        typeof content !== 'string' ||
        receiverPseudo.trim() === '' ||
        trimmedContent === ''
      ) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Invalid SEND_DM payload',
        }));
        return;
      }
      if (content.length > MAX_DM_MESSAGE_LENGTH) {
        socket.send(JSON.stringify({
          type: 'error',
          message: `Message too long (max ${MAX_DM_MESSAGE_LENGTH} characters)`,
        }));
        return;
      }

      const conv = await createDmConversation(pseudo, receiverPseudo);
      if (!conv) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Cannot create DM conversation',
        }));
        return;
      }

      const result = await newDirectMessage(pseudo, conv.id, content);
      if (!result.success || !result.new_message) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Failed to save message',
        }));
        return;
      }

      const payload = {
        type: 'NEW_MESSAGE',
        data: result.new_message,
      };

      sendToUser(receiverPseudo, payload);
      sendToUser(pseudo, payload);
      break;
    }
    default:
      server.log.warn(`Unknown message type: ${message.type}`);
  }
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

export default fp(websocketPlugin, {
  name: 'websocket-plugin',
});