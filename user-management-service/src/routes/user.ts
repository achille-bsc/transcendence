import { FastifyInstance } from 'fastify';
import { prisma } from '../../database-service/prisma';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import multipart from '@fastify/multipart';
import sharp from 'sharp';

export default async function userRoutes(server: FastifyInstance) {

  server.post('/profileuser', { onRequest: [server.authenticate]},
    async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { pseudo: request.user.pseudo },
      select: {
        pseudo: true,
        createdAt: true,
        lastLoginAt: true,
      }
    });
    if (!user)
      return reply.code(404).send({ error: 'User not found' });
    return { user };
  });

  server.post('/profileother', { onRequest: [server.authenticate]}, 
    async (request, reply) => {
    const { pseudo } = request.body as {
        pseudo: string;
    };
    const user = await prisma.user.findUnique({
      where: { pseudo: pseudo },
      select: {
        pseudo: true,
        createdAt: true,
        lastLoginAt: true,
      }
    });
    if (!user)
      return reply.code(404).send({ error: 'User not found' });
    return { user };
  });


server.post('/avatar', {
  onRequest: [server.authenticate] 
}, async (request, reply) => {
  const data = await request.file();
  if (!data) {
    return reply.code(400).send({ error: "No image received" });
  }
  const resizer = sharp()
  .resize(512, 512, {
    fit: 'cover',
    position: 'center'
  }).png();
  const extension = path.extname(data.filename);
  const fileName = `${request.user.pseudo}${extension}`;
  const uploadPath = path.join('/app/uploads', fileName);

  try {
    await pipeline(data.file, resizer, createWriteStream(uploadPath));

    await prisma.user.update({
      where: { pseudo: request.user.pseudo },
      data: { avatar: fileName }
    });

    return { 
      success: true, 
      message: "Avatar uploaded successfully",
      avatarUrl: `/public/${fileName}` 
    };
  } catch (err) {
    server.log.error(err);
    return reply.code(500).send({ error: "Erreur lors de l'enregistrement de l'image" });
  }
});
}