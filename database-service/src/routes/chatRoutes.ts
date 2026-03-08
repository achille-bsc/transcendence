import { FastifyInstance } from 'fastify';
import { createDmConversation, newDirectMessage } from '../utils/utils_message';

export default async function chatDataRoutes(server: FastifyInstance) {

  // Appelé par le chat-service pour créer une conversation DM
  server.post('/chat/create-dm', {
    onRequest: [server.requireBackendPass],
  }, async (request, reply) => {
    const { user1Pseudo, user2Pseudo } = request.body as {
      user1Pseudo: string;
      user2Pseudo: string;
    };
    const conv = await createDmConversation(user1Pseudo, user2Pseudo);
    if (!conv) {
      return reply.code(400).send({ error: 'Cannot create DM conversation' });
    }
    return { success: true, data: conv };
  });

  // Appelé par le chat-service pour sauvegarder un nouveau message
  server.post('/chat/new-message', {
    onRequest: [server.requireBackendPass],
  }, async (request, reply) => {
    const { senderPseudo, conversationId, content } = request.body as {
      senderPseudo: string;
      conversationId: string;
      content: string;
    };
    const result = await newDirectMessage(senderPseudo, conversationId, content);
    if (!result.success || !result.new_message) {
      return reply.code(500).send({ error: 'Failed to save message' });
    }
    return { success: true, data: result.new_message };
  });
}