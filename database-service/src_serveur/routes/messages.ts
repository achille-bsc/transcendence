import { createDmConversation, findDmConvesation, newDirectMessage } from '../utils/utils_message';
import { FastifyInstance } from 'fastify';

function parsePositiveInt(value: number | string | undefined): number | undefined {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0 ? value : undefined;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      return undefined;
    }
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  }
  return undefined;
}


export default async function messageRoutes(server: FastifyInstance) {
  server.post("/chat/send/dm", {
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
    const wsPayload = {
       type: 'NEW_MESSAGE',
       data: result.new_message
    };
    server.sendToUser(receiverPseudo, wsPayload);
    return { status: "success", message: "DM sent successfully.", data: result.new_message };
  });

  server.post("/chat/find/dm", {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const { receiverPseudo, beforeId, limit } = request.body as {
      receiverPseudo: string;
      beforeId?: number | string;
      limit?: number | string;
    };
    const senderPseudo = request.user.pseudo;
    const parsedBeforeId = parsePositiveInt(beforeId);
    const parsedLimit = parsePositiveInt(limit);
    const conv = await findDmConvesation(senderPseudo, receiverPseudo, {
      beforeId: parsedBeforeId,
      limit: parsedLimit,
    });
    if (!conv) {
      return reply.code(408).send({ error: 'Conversation not found' });
    }
    return { status: "success", message: "Conversation found.", data: conv };
  });
}