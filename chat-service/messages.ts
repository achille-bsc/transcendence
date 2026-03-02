import { createDmConversation, findDmConvesation, newDirectMessage } from '../utils/utils_message';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';


export default async function messageRoutes(server: FastifyInstance) {
  server.post("/chat/send/dm", {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const { receiverPseudo, content } = request.body as {
      receiverPseudo: string;
      content: string;
    };
    console.log("voici :",request.user.id);
    const senderPseudo = request.user.pseudo;
    const conv = await createDmConversation(senderPseudo, receiverPseudo);
    if (!conv) {
      return reply.code(400).send({ error: 'Cannot create DM conversation' });
    }
    const result = await newDirectMessage(request.user.id, conv.id, content);
    if (!result.success || !result.new_message) {
       return reply.code(500).send({ error: 'Failed to save message' });
    }
    const wsPayload = JSON.stringify({
       type: 'NEW_MESSAGE',
       data: result.new_message
    });
    server.sendToUser(result.new_message.receiverId, wsPayload);
    console.log(result.new_message);
    return reply.send({ data: result.new_message });
  });

  server.post("/chat/find/dm", {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    const { receiverPseudo } = request.body as {
      receiverPseudo: string;
    };
    const senderPseudo = request.user.pseudo;
    const conv = await findDmConvesation(senderPseudo, receiverPseudo);
    if (!conv) {
      return reply.code(400).send({ error: 'Conversation not found' });
    }
    return { status: "success", message: "Conversation found.", data: conv };
  });
}