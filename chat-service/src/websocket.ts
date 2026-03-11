import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';
import { WebSocket } from 'ws';
import fs from 'fs';


try {
  fs.accessSync('/run/secrets/api_pass', fs.constants.R_OK);
} catch (err) {
  console.error("Error: Unable to read API password from /run/secrets/api_pass. Please ensure the file exists and has the correct permissions.");
  process.exit(1);
}
const api_pass = fs.readFileSync('/run/secrets/api_pass', 'utf-8').trim();

export const clients = new Map<string, Set<WebSocket>>();
const MAX_DM_MESSAGE_LENGTH = 1000;

async function dbCreateDmConversation(user1Pseudo: string, user2Pseudo: string) {
  const res = await fetch(`https://database-service:5000/create-dm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-backend-pass': api_pass,
    },
    body: JSON.stringify({ user1Pseudo, user2Pseudo }),
  });

  const data = await res.json();
  //if (!res.ok) 
  //  return null;
  return data;
}

async function dbNewDirectMessage(senderId: string, conversationId: number, content: string) {
  const res = await fetch(`https://database-service:5000/create-message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-backend-pass': api_pass,
    },
    body: JSON.stringify({ senderId, conversationId, content }),
  });
  const data = await res.json()
  if (!res.ok) return { success: false };
  return data;
}

async function verifyTokenWithAuth(token: string): Promise<string | null> {
  try {
    const res = await fetch(`https://auth-service:3001/validate`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json() as any;
    return data?.pseudo ?? null;
  } catch {
    return null;
  }
}

async function chatWebsocketPlugin(server: FastifyInstance) {
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
      const pseudo = await verifyTokenWithAuth(token);
      if (!pseudo) {
        socket.close(1008, 'Invalid token');
        return;
      }

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
        } catch {
          socket.send(JSON.stringify({ type: 'error', message: 'Invalid JSON format' }));
          return;
        }
        try {
          await handleClientMessage(server, pseudo, socket, message);
        } catch {
          socket.send(JSON.stringify({ type: 'error', message: 'Internal websocket error' }));
        }
      });

      socket.on('close', () => {
        const userSockets = clients.get(pseudo);
        if (userSockets) {
          userSockets.delete(socket);
          if (userSockets.size === 0) clients.delete(pseudo);
        }
      });

      socket.on('error', () => {
        const userSockets = clients.get(pseudo);
        userSockets?.delete(socket);
        if (userSockets?.size === 0) clients.delete(pseudo);
      });
    } catch {
      socket.close(1008, 'Invalid token');
    }
  });

  server.get('/online-users', async (request: FastifyRequest, reply: FastifyReply) => {
    const key = request.headers['x-backend-pass'] as string;
    if (!key || key !== api_pass) {
      return reply.code(403).send({ error: 'Forbidden' });
    }
    return { users: getOnlineUsers() };
  });
  
  server.decorate('sendToUser', sendToUser);
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
        socket.send(JSON.stringify({ type: 'error', message: 'Invalid SEND_DM payload' }));
        return;
      }
      if (content.length > MAX_DM_MESSAGE_LENGTH) {
        socket.send(JSON.stringify({
          type: 'error',
          message: `Message too long (max ${MAX_DM_MESSAGE_LENGTH} characters)`,
        }));
        return;
      }
      const conv = await dbCreateDmConversation(pseudo, receiverPseudo);
      console.error(`Caca2`);
      if (!(conv?.id ?? null)) {
        console.error(`Caca3`);
        socket.send(JSON.stringify({ type: 'error', message: 'Cannot create DM conversation' }));
        return;
      }
      const result = await dbNewDirectMessage(pseudo, conv.id, content);
      if (!result.success || !result.new_message) {
        socket.send(JSON.stringify({ type: 'error', message: 'Failed to save message' }));
        return;
      }

      const payload = { type: 'NEW_MESSAGE', data: result.new_message };
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

function getOnlineUsers(): string[] {
  return Array.from(clients.keys());
}

declare module 'fastify' {
  interface FastifyInstance {
    sendToUser(pseudo: string, message: any): boolean;
    getOnlineUsers(): string[];
  }
}

export default fp(chatWebsocketPlugin, {
  name: 'chat-websocket-plugin',
});