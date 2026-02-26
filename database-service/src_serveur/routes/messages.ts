import { createDmConversation, newDirectMessage } from '../utils/utils_message';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../prisma';
import { findUserByPseudo } from '../utils/utils_user';
//TODO
export default async function messageRoutes(server: FastifyInstance) {
  server.post("/chat/dm", {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const { receiverPseudo, content } = request.body as {
      receiverPseudo: string;
      content: string;
    };
    const senderPseudo = request.user.pseudo;
    const conv = await createDmConversation(senderPseudo, receiverPseudo);
    if (!conv) {
      return reply.code(400).send({ error: 'Cannot create DM conversation' });
    }
    const result = await newDirectMessage(senderPseudo, conv.id, content);
    if (!result.success || !result.new_message) {
       return reply.code(500).send({ error: 'Failed to save message' });
    }
    const wsPayload = JSON.stringify({
       type: 'NEW_MESSAGE',
       data: result.new_message
    });
    server.sendToUser(receiverPseudo, wsPayload);
    return { status: "success", message: "DM sent successfully.", data: result.new_message };
  });
}