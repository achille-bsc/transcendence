import { FastifyInstance } from 'fastify';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

const api_pass = fs.readFileSync('/run/secrets/api_pass', 'utf-8').trim();

export default async function userRoutes(server: FastifyInstance) {

  server.get('/profile', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const res = await fetch("https://database-service:5000/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
      body: JSON.stringify({ pseudo: request.user.pseudo })
    });
    const data = await res.json();
    if (!res.ok) return reply.code(res.status).send(data);
    return { user: data };
  });

  server.post('/profileother', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const { pseudo } = request.body as { pseudo: string };
    const res = await fetch("https://database-service:5000/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
      body: JSON.stringify({ pseudo })
    });
    const data = await res.json();
    if (!res.ok) return reply.code(res.status).send(data);
    return { user: data };
  });

  server.post('/avatar', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const data = await request.file();
    if (!data)
      return reply.code(400).send({ error: "No image received" });

    const resizer = sharp()
      .resize(512, 512, { fit: 'cover', position: 'center' })
      .png();
    const extension = path.extname(data.filename);
    const fileName = `${request.user.pseudo}${extension}`;
    const uploadPath = path.join('/app/avatars', fileName);

    try {
      await pipeline(data.file, resizer, createWriteStream(uploadPath));
      await fetch("https://database-service:5000/user/update-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ pseudo: request.user.pseudo, avatar: fileName })
      });
      return { success: true, message: "Avatar uploaded", avatarUrl: `/public/${fileName}` };
    } catch (err) {
      server.log.error(err);
      return reply.code(500).send({ error: "Error saving image" });
    }
  });
  server.get('/useravatar', { onRequest: [server.authenticate] },
    async (request, reply) => {
      const res = await fetch("https://database-service:5000/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ pseudo: request.user.pseudo })
      });
      const data = await res.json();
      if (!res.ok)
        return reply.code(res.status).send(data);
      const user = data;
      console.log("\n\n\n\n\nUser cool :", user);
      return {
        success: true,
        avatarUrl: user.avatarUrl
      };
    });

  server.post('/avatarother', { onRequest: [server.authenticate] },
    async (request, reply) => {
      const { pseudo } = request.body as { pseudo: string };
      const res = await fetch("https://database-service:5000/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ pseudo : pseudo})
      });
      const data = await res.json();
      if (!res.ok)
        return reply.code(res.status).send(data);
      const user = data;
      if (!user?.avatar)
        return reply.code(404).send({ error: 'Aucun avatar trouvé' });

      return { success: true, avatarUrl: `/public/${user.avatar}`};
    });

  server.post('/userstatus', { onRequest: [server.authenticate] },
      async (request, reply) => {
    const { pseudo } = request.body as { pseudo?: string };
    const targetPseudo = pseudo ?? (request.user as any).pseudo;
    if (!targetPseudo || targetPseudo.trim() === '') {
      return reply.code(400).send({ error: 'Pseudo is required' });
    }
    try {
      const res = await fetch("/https://chat-service:3004/online-users", {
        method: "GET",
        headers: { 'x-backend-pass': api_pass }
      });
      const data = await res.json();
      if (!res.ok) {
        return reply.code(res.status).send(data);
      }
      const onlinePseudos: string[] = data.users || [];
      return {
        success: true,
        pseudo: targetPseudo,
        isOnline: onlinePseudos.includes(targetPseudo),
      };
    } catch (err) {
      server.log.error(err);
      return reply.code(500).send({ error: "Erreur de communication avec le chat-service" });
    }
  });
  server.put('/email', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const { email } = request.body as { email?: string };

    if (!email || email.trim() === '') {
      return reply.code(408).send({ error: "The new email is required" });
    }
    else if (!email || email.length === 0 || email.includes(' ') ||
        email.split('@').length !== 2 || !email.includes('.'))
    {
        return reply.code(408).send({ error: "Enter a valid email address" })
    }
    try {
      const res = await fetch("https://database-service:5000/user/update-email", {
        method: "PUT",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ 
          pseudo: (request.user as any).pseudo, 
          email: email 
        })
      });
      const data = await res.json();
      if (!res.ok) 
        return reply.code(res.status).send(data);
      return { success: true, message: "Email updated successfully" };
    } catch (err) {
      server.log.error(err);
      return reply.code(500).send({ error: "Error updating email" });
    }
  });
  
  server.put('/apikey', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    
    
    const newApiKey = 'sk_' + crypto.randomBytes(24).toString('hex');

    try {
      const res = await fetch("https://database-service:5000/user/update-apikey", {
        method: "PUT",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ 
          pseudo: (request.user as any).pseudo, 
          apiKey: newApiKey 
        })
      });
      const data = await res.json();
      if (!res.ok) return reply.code(res.status).send(data);
      return { 
        success: true, 
        message: "New key generated successfully",
        apiKey: newApiKey 
      };
    } catch (err) {
      server.log.error(err);
      return reply.code(500).send({ error: "Error generating API key" });
    }
  });

  
  }