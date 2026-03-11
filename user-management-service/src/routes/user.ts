import { FastifyInstance } from 'fastify';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import crypto from 'crypto';

try {
  fs.accessSync('/run/secrets/api_pass', fs.constants.R_OK);
} catch (err) {
  console.error("Error: Unable to read API password");
  process.exit(1);
}
const api_pass = fs.readFileSync('/run/secrets/api_pass', 'utf-8').trim();

export default async function userRoutes(server: FastifyInstance) {

  server.get('/profile', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    try {
      const res = await fetch("https://database-service:5000/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ pseudo: request.user.pseudo })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data?.error || 'User not found' };
      return { success: true, user: data };
    } catch (err) {
      server.log.error(err);
      return { success: false, error: 'Internal server error' };
    }
  });

  server.post('/profileother', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    try {
      const { pseudo } = request.body as { pseudo: string };
      const res = await fetch("https://database-service:5000/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ pseudo })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data?.error || 'User not found' };
      return { success: true, user: data };
    } catch (err) {
      server.log.error(err);
      return { success: false, error: 'Internal server error' };
    }
  });

  server.post('/avatar', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const data = await request.file();
    if (!data)
      return { success: false, error: "No image received" };

    const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);
    if (!allowedMimeTypes.has(data.mimetype)) {
      data.file.resume();
      return { success: false, error: "Unsupported file type" };
    }

    const fileName = `${request.user.pseudo}.png`;
    const uploadPath = path.join('/app/avatars', fileName);

    try {
      const fileBuffer = await data.toBuffer();

      try {
        await sharp(fileBuffer, { animated: true })
          .resize(512, 512, { fit: 'cover', position: 'center' })
          .png()
          .toFile(uploadPath);
      } catch (sharpError) {
        if (data.mimetype === 'image/png') {
          await fs.promises.writeFile(uploadPath, fileBuffer);
        } else {
          throw sharpError;
        }
      }

      await fetch("https://database-service:5000/user/update-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ pseudo: request.user.pseudo, avatar: fileName })
      });
      return { success: true, message: "Avatar uploaded", avatarUrl: `/public/${fileName}` };
    } catch (err) {
      server.log.error(err);
      return { success: false, error: "Error saving image" };
    }
  });
  server.get('/useravatar', { onRequest: [server.authenticate] },
    async (request, reply) => {
      try {
        const res = await fetch("https://database-service:5000/user/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
          body: JSON.stringify({ pseudo: request.user.pseudo })
        });
        const data = await res.json();
        if (!res.ok)
          return { success: false, error: data?.error || 'Avatar not found' };
        return {
          success: true,
          avatarUrl: data.avatarUrl
        };
      } catch (err) {
        server.log.error(err);
        return { success: false, error: 'Internal server error' };
      }
    });

  server.post('/avatarother', { onRequest: [server.authenticate] },
    async (request, reply) => {
      try {
        const { pseudo } = request.body as { pseudo: string };
        const res = await fetch("https://database-service:5000/user/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
          body: JSON.stringify({ pseudo : pseudo})
        });
        const data = await res.json();
        if (!res.ok)
          return { success: false, error: data?.error || 'Avatar not found' };
        if (!data?.avatarUrl)
          return { success: false, error: 'Avatar not found' };
        return { success: true, avatarUrl: data.avatarUrl};
      } catch (err) {
        server.log.error(err);
        return { success: false, error: 'Internal server error' };
      }
    });

  server.post('/userstatus', { onRequest: [server.authenticate] },
      async (request, reply) => {
    const { pseudo } = request.body as { pseudo?: string };
    const targetPseudo = pseudo ?? (request.user as any).pseudo;
    if (!targetPseudo || targetPseudo.trim() === '') {
      return { success: false, error: 'Pseudo is required', isOnline: false };
    }
    try {
      const res = await fetch("https://chat-service:3004/online-users", {
        method: "GET",
        headers: { 'x-backend-pass': api_pass }
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data?.error || 'Service unavailable', isOnline: false };
      }
      const onlinePseudos: string[] = data.users || [];
      return {
        success: true,
        pseudo: targetPseudo,
        isOnline: onlinePseudos.includes(targetPseudo),
      };
    } catch (err) {
      server.log.error(err);
      return { success: false, error: 'Internal server error', isOnline: false };
    }
  });
  server.put('/email', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const { email } = request.body as { email?: string };

    if (!email || email.trim() === '') {
      return { success: false, error: "The new email is required" };
    }
    else if (!email || email.length === 0 || email.includes(' ') ||
        email.split('@').length !== 2 || !email.includes('.'))
    {
        return { success: false, error: "Enter a valid email address" };
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
        return { success: false, error: data?.error || 'Error updating email' };
      return { success: true, message: "Email updated successfully" };
    } catch (err) {
      server.log.error(err);
      return { success: false, error: "Error updating email" };
    }
  });

  server.get('/email', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    try {
      const res = await fetch("https://database-service:5000/user/email", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-backend-pass': api_pass },
        body: JSON.stringify({ pseudo: (request.user as any).pseudo })
      });
      const data = await res.json();
      if (!res.ok)
        return { success: false, error: data?.error || 'Error fetching email' };
      return { success: true, user: data };
    } catch (err) {
      server.log.error(err);
      return { success: false, error: "Error fetching email" };
    }
  });
  
  server.get('/apikey', {
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
      if (!res.ok) return { success: false, error: data?.error || 'Error generating API key' };
      return { 
        success: true, 
        message: "New key generated successfully",
        apiKey: newApiKey 
      };
    } catch (err) {
      server.log.error(err);
      return { success: false, error: "Error generating API key" };
    }
  });

  
  }