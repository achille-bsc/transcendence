import { FastifyInstance, FastifyRequest } from 'fastify';
import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';
import { WebSocket } from 'ws';
import fs from 'fs';

export const presenceClients = new Map<string, Set<WebSocket>>();

const AUTH_URL = 'http://auth-service:3001';
const DB_URL = 'http://database-service:5000';
// On lit le pass pour parler à la BDD plus tard
const apiPass = fs.readFileSync('/run/secrets/api_pass', 'utf-8').trim(); 

async function presenceWebsocketPlugin(server: FastifyInstance) {
  await server.register(websocket, { options: { maxPayload: 1048576 } });

  server.get('/ws', { websocket: true }, async (socket, req: FastifyRequest) => {
    try {
      const token = (req.query as { token?: string }).token;
      if (!token) return socket.close(1008, 'Token required');

      // 1. Validation via l'auth-service
      const authResponse = await fetch(`/api/auth/validate`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!authResponse.ok) return socket.close(1008, 'Invalid token');
      
      const { pseudo } = await authResponse.json();

      // 2. Enregistrement
      if (!presenceClients.has(pseudo)) {
        presenceClients.set(pseudo, new Set());
        
        // --- 🎯 TON DÉFI ICI ---
        // Tu dois faire un fetch vers DB_URL pour récupérer la liste 
        // d'amis de 'pseudo' (n'oublie pas le header x-backend-pass).
        // Une fois reçue, tu utilises presenceClients pour leur envoyer
        // un socket.send() disant que ce joueur est "online".
      }
      presenceClients.get(pseudo)!.add(socket);

      socket.on('message', (data: Buffer) => {
        const message = JSON.parse(data.toString());
        if (message.type === 'ping') {
          socket.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        }
      });

      socket.on('close', () => {
        const userSockets = presenceClients.get(pseudo);
        if (userSockets) {
          userSockets.delete(socket);
          if (userSockets.size === 0) {
            presenceClients.delete(pseudo);
            // --- 🎯 TON DÉFI ICI ---
            // Même chose : prévenir les amis que le joueur est "offline".
          }
        }
      });
    } catch (error) {
      socket.close(1008, 'Connection error');
    }
  });
}

export default fp(presenceWebsocketPlugin, { name: 'presence-websocket' });