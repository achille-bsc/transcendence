import { FastifyInstance } from 'fastify';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

const api_pass = fs.readFileSync('/run/secrets/api_pass', 'utf-8').trim();

export default async function userRoutes(server: FastifyInstance) {

  server.post('/profileuser', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const res = await fetch("/api/db/user/profile", {
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
    const res = await fetch("/api/db/user/profile", {
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
    const uploadPath = path.join('/app/uploads', fileName);

    try {
      await pipeline(data.file, resizer, createWriteStream(uploadPath));
      await fetch("/api/db/user/update-avatar", {
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
}