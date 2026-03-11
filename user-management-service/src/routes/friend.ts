import { FastifyInstance } from 'fastify';
import fs from 'fs';

try {
  fs.accessSync('/run/secrets/api_pass', fs.constants.R_OK);
} catch (err) {
  console.error("Error: Unable to read API password");
  process.exit(1);
}
const api_pass = fs.readFileSync('/run/secrets/api_pass', 'utf-8').trim();

export default async function friendRoutes(server: FastifyInstance) {

  server.get('/friend', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    try {
      const res = await fetch("https://database-service:5000/friend", {
        method: "GET",
        headers: {
          'x-backend-pass': api_pass,
          'x-user-pseudo': request.user.pseudo
        }
      });
      const data = await res.json();
      if (!res.ok)
        return { success: false, error: data?.error || 'Error fetching friends' };
      return { success: true, friends: data };
    } catch (err) {
      return { success: false, error: 'Internal server error' };
    }
  });

  server.get('/receive', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    try {
      const res = await fetch("https://database-service:5000/friend/receive", {
        method: "GET",
        headers: {
          'x-backend-pass': api_pass,
          'x-user-pseudo': request.user.pseudo
        }
      });
      const data = await res.json();
      if (!res.ok)
        return { success: false, error: data?.error || 'Error fetching pending requests' };
      return data;
    } catch (err) {
      return { success: false, error: 'Internal server error' };
    }
  });

  server.post('/send', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    try {
      const { friendPseudo } = request.body as { friendPseudo: string };
      const myPseudo = request.user.pseudo;
      if (myPseudo === friendPseudo)
        return { success: false, error: "You can't add yourself" };

      const existsRes = await fetch("https://database-service:5000/user/exists", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ pseudo: friendPseudo })
      });
      if (!existsRes.ok)
        return { success: false, error: "This account doesn't exist" };

      const res = await fetch("https://database-service:5000/friend/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ myPseudo, friendPseudo })
      });
      const data = await res.json();
      if (!res.ok)
        return { success: false, error: data?.error || 'Error sending friend request' };
      return data;
    } catch (err) {
      return { success: false, error: 'Internal server error' };
    }
  });

  server.post('/accept', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    try {
      const { friendPseudo } = request.body as { friendPseudo: string };
      const res = await fetch("https://database-service:5000/friend/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ myPseudo: request.user.pseudo, friendPseudo })
      });
      const data = await res.json();
      if (!res.ok)
        return { success: false, error: data?.error || 'Error accepting request' };
      return data;
    } catch (err) {
      return { success: false, error: 'Internal server error' };
    }
  });

  server.post('/remove', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    try {
      const { friendPseudo } = request.body as { friendPseudo: string };
      const res = await fetch("https://database-service:5000/friend/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ myPseudo: request.user.pseudo, friendPseudo })
      });
      const data = await res.json();
      if (!res.ok)
        return { success: false, error: data?.error || 'Error removing friend' };
      return data;
    } catch (err) {
      return { success: false, error: 'Internal server error' };
    }
  });

  server.post('/refuse', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    try {
      const { friendPseudo } = request.body as { friendPseudo: string };
      const res = await fetch("https://database-service:5000/friend/refuse", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ myPseudo: request.user.pseudo, friendPseudo })
      });
      const data = await res.json();
      if (!res.ok)
        return { success: false, error: data?.error || 'Error refusing request' };
      return data;
    } catch (err) {
      return { success: false, error: 'Internal server error' };
    }
  });
}