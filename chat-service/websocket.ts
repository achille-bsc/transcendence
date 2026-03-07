import { FastifyInstance, FastifyRequest } from 'fastify';
import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';
import { WebSocket } from 'ws';

export const chatClients = new Map<string, Set<WebSocket>>();
const AUTH_URL = 'http://auth-service:3001';

async function chatWebsocketPlugin(server: FastifyInstance) {
  await server.register(websocket, { options: { maxPayload: 1048576 } });

  server.get('/ws', { websocket: true }, async (socket, req: FastifyRequest) => {
    try {
      // 1. Validation via l'auth-service (identique au user-management)
      const token = (req.query as { token?: string }).token;
      if (!token) return socket.close(1008, 'Token required');

      const authResponse = await fetch(`${AUTH_URL}/validate`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!authResponse.ok) return socket.close(1008, 'Invalid token');
      
      const { pseudo } = await authResponse.json();

      // 2. Enregistrement pour la réception
      if (!chatClients.has(pseudo)) chatClients.set(pseudo, new Set());
      chatClients.get(pseudo)!.add(socket);

      // Le client ne fait qu'écouter. S'il essaie d'envoyer un message via WS, 
      // on peut lui dire d'utiliser l'API HTTP à la place.
      socket.on('message', () => {
         socket.send(JSON.stringify({ 
           type: 'info', 
           message: 'Please use the HTTP POST /message route to send messages.' 
         }));
      });

      socket.on('close', () => {
        const userSockets = chatClients.get(pseudo);
        if (userSockets) {
          userSockets.delete(socket);
          if (userSockets.size === 0) chatClients.delete(pseudo);
        }
      });
    } catch (error) {
      socket.close(1008, 'Connection error');
    }
  });

  // Cette fonction permettra à ta route HTTP (POST /message) 
  // d'injecter le message dans le bon tuyau WebSocket une fois sauvegardé en BDD !
  server.decorate('sendChatMessage', (receiverPseudo: string, payload: any) => {
    const userSockets = chatClients.get(receiverPseudo);
    if (userSockets) {
      userSockets.forEach(s => {
        if (s.readyState === WebSocket.OPEN) s.send(JSON.stringify(payload));
      });
    }
  });
}

export default fp(chatWebsocketPlugin, { name: 'chat-websocket' });