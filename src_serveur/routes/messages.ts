import { newDirectMessage } from '../utils/utils_message';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

//TODO
export default async function messageRoutes(server: FastifyInstance) {
  server.post("/dm", {
    onRequest: [server.authenticate]
    }, async (request, reply) => {
    try {
      const sender_id = request.user.id;
      const { receiver_id, content } = request.body as {
        receiver_id: number;
        content: string
      };
      if (sender_id === receiver_id)
        return reply.status(400).send({ 
          status: "failed",
          message: "sender and receiver id shouldn't be the same"
        });
      await newDirectMessage(sender_id, receiver_id, content);
      
      //TODO
      
      return reply.status(200).send({
        status: "success",
        message: "message successfully sent"
      });
    } catch (err) {
      console.error(err);
      return reply.status(405).send({
        status: "failure",
        message: "Internal server error."
      });
    }
  });
}