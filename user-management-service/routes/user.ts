import { FastifyInstance } from 'fastify';
import { prisma } from '../../database-service/prisma';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import sharp from 'sharp';


  server.post('/profileuser', { onRequest: [server.authenticate] },
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

  server.post('/profileother', { onRequest: [server.authenticate] },
    async (request, reply) => {
      const { pseudo } = request.body as { pseudo: string };
      const user = await prisma.user.findUnique({
        where: { pseudo },
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

  server.post('/avatar', { onRequest: [server.authenticate] },
    async (request, reply) => {
      const data = await request.file();

      if (!data)
        return reply.code(400).send({ error: 'No image received' });

      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowed.includes(data.mimetype))
        return reply.code(400).send({ error: 'Format non supporté (jpeg, png, webp uniquement)' });

      const fileName = `${request.user.pseudo}.png`;
      const uploadPath = path.join('/app/uploads', fileName);

      try {
        await pipeline(
          data.file,
          sharp({ failOn: 'none' })
            // .resize(512, 512, { fit: 'cover', position: 'center' })
            .toFormat('png'),
          createWriteStream(uploadPath)
        );

        await prisma.user.update({
          where: { pseudo: request.user.pseudo },
          data: { avatar: fileName }
        });

        return {
          success: true,
          message: 'Avatar uploaded successfully',
          avatarUrl: `/public/${fileName}`
        };
      } catch (err) {
        server.log.error(err);
        return reply.code(500).send({ error: "Erreur lors de l'enregistrement de l'image" });
      }
    });

  server.get('/useravatar', { onRequest: [server.authenticate] },
    async (request, reply) => {
      const user = await prisma.user.findUnique({
        where: { pseudo: request.user.pseudo },
        select: { avatar: true }
      });

      if (!user?.avatar)
        return reply.code(404).send({ error: 'Aucun avatar trouvé' });

      return {
        success: true,
        avatarUrl: `/public/${user.avatar}`
      };
    });

  server.post('/avatarother', { onRequest: [server.authenticate] },
    async (request, reply) => {
      const { pseudo } = request.body as { pseudo: string };
      const user = await prisma.user.findUnique({
        where: { pseudo: pseudo },
        select: { avatar: true }
      });

      if (!user?.avatar)
        return reply.code(404).send({ error: 'Aucun avatar trouvé' });

      return {
        success: true,
        avatarUrl: `/public/${user.avatar}`
      };
    });

  server.post('/userstatus', { onRequest: [server.authenticate] },
    async (request, reply) => {
      const { pseudo } = request.body as { pseudo?: string };
      const targetPseudo = pseudo ?? request.user.pseudo;

      if (!targetPseudo || targetPseudo.trim() === '') {
        return reply.code(400).send({ error: 'Pseudo is required' });
      }

      const onlinePseudos = server.getOnlineUsers ? server.getOnlineUsers() : [];
      return {
        success: true,
        pseudo: targetPseudo,
        isOnline: onlinePseudos.includes(targetPseudo),
      };
    });
}