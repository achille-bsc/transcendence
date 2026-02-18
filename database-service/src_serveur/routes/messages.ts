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
    const conv = await createDmConversation(senderId, receiverId);
    if (!conv) {
      return reply.code(400).send({ error: 'Cannot create DM conversation' });
    }
    const result = await newDirectMessage(senderId, conv.id, content);
    if (!result.success || !result.new_message) {
       return reply.code(500).send({ error: 'Failed to save message' });
    }
    const wsPayload = JSON.stringify({
       type: 'NEW_MESSAGE',
       data: result.new_message
    });
    server.sendToUser(receiverId, wsPayload);
    return { status: "success", message: "DM sent successfully.", data: result.new_message };
  });
}