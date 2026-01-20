import { createDmConversation, newDirectMessage } from '../utils/utils_message';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../prisma';
//TODO
export default async function messageRoutes(server: FastifyInstance) {
  server.post("/chat/dm", {
    onRequest: [server.authenticate]
    }, async (request, reply) => {
      const { receiverId, content } = request.body as {
        receiverId: number;
        content: string;
      };
      const senderId = request.user.id;
    const conv = createDmConversation(senderId, receiverId);
    if (!conv)
      return reply.code(400).send({ error: 'Cannot create DM conversation' });
    const message = await newDirectMessage(senderId, receiverId, content);
    return { status: "success", message: "DM sent successfully." };
    });
}