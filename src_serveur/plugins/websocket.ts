import { FastifyInstance } from 'fastify';
import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';
import { WebSocket } from 'ws'; // ← Import depuis ws

// Store pour les clients connectés
export const clients = new Map<number, Set<WebSocket>>();

async function websocketPlugin(server: FastifyInstance) {
  // 1. Enregistre le plugin @fastify/websocket
  await server.register(websocket, {
    options: {
      maxPayload: 1048576, // 1MB
      verifyClient: (info, next) => {
        const userId = info.req.headers['user-id'];
        
        if (!userId) {
          server.log.warn('WebSocket connection attempt without user-id');
          return next(false, 401, 'user-id header required');
        }
        
        next(true);
      },
    },
  });

  // 2. Route WebSocket
  server.get('/ws', { websocket: true }, (socket, req) => {
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
    
    // Ajoute le socket au store
    if (!clients.has(userId)) {
      clients.set(userId, new Set());
    }
    
    clients.get(userId)!.add(socket);
    
    const deviceCount = clients.get(userId)!.size;
    server.log.info(`User ${userId} connected (${deviceCount} device(s)). Total users: ${clients.size}`);
    
    // Notifie le client de sa connexion
    socket.send(JSON.stringify({
      type: 'connected',
      userId,
      timestamp: new Date().toISOString(),
    }));
    
    // Gestion des messages entrants
    socket.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        handleClientMessage(server, userId, socket, message);
      } catch (error) {
        server.log.error(error, 'Invalid message format:');
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Invalid JSON format',
        }));
      }
    });
    
    // Gestion de la déconnexion
    socket.on('close', () => {
      const userSockets = clients.get(userId);
      userSockets?.delete(socket);
      
      if (userSockets?.size === 0) {
        clients.delete(userId);
      }
      
      server.log.info(`User ${userId} disconnected. Total users: ${clients.size}`);
    });
    
    // Gestion des erreurs
    socket.on('error', (error) => {
      server.log.error(error, `WebSocket error for user ${userId}:`);
      
      const userSockets = clients.get(userId);
      userSockets?.delete(socket);
      
      if (userSockets?.size === 0) {
        clients.delete(userId);
      }
    });
  });

  // 3. Décore Fastify avec des fonctions utilitaires
  server.decorate('sendToUser', sendToUser);
  server.decorate('sendToUsers', sendToUsers);
  server.decorate('broadcastToAll', broadcastToAll);
  server.decorate('getOnlineUsers', getOnlineUsers);
  
  server.log.info('WebSocket plugin registered');
}

// ==================
// HANDLERS
// ==================

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
      server.log.warn(`Unknown message type from user ${userId}: ${message.type}`);
  }
}

// ==================
// UTILITY FUNCTIONS
// ==================

function sendToUser(userId: number, message: any): boolean {
  const sockets = clients.get(userId);
  
  if (!sockets || sockets.size === 0) {
    return false;
  }
  
  const messageStr = JSON.stringify(message);
  let sent = 0;
  
  sockets.forEach(socket => {
    if (socket.readyState === WebSocket.OPEN) { // ← WebSocket.OPEN au lieu de socket.OPEN
      socket.send(messageStr);
      sent++;
    }
  });
  
  return sent > 0;
}

function sendToUsers(userIds: number[], message: any): number {
  const messageStr = JSON.stringify(message);
  let totalSent = 0;
  
  userIds.forEach(userId => {
    const sockets = clients.get(userId);
    
    if (sockets) {
      sockets.forEach(socket => {
        if (socket.readyState === WebSocket.OPEN) { // ← WebSocket.OPEN
          socket.send(messageStr);
          totalSent++;
        }
      });
    }
  });
  
  return totalSent;
}

function broadcastToAll(message: any): number {
  const messageStr = JSON.stringify(message);
  let totalSent = 0;
  
  clients.forEach((sockets) => {
    sockets.forEach(socket => {
      if (socket.readyState === WebSocket.OPEN) { // ← WebSocket.OPEN
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

// ==================
// TYPE AUGMENTATION
// ==================

declare module 'fastify' {
  interface FastifyInstance {
    sendToUser(userId: number, message: any): boolean;
    sendToUsers(userIds: number[], message: any): number;
    broadcastToAll(message: any): number;
    getOnlineUsers(): number[];
  }
}

export default fp(websocketPlugin, {
  name: 'websocket-plugin',
});