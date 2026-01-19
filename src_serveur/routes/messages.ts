import { FastifyInstance } from 'fastify';
import { newDirectMessage } from '../utils/utils_message';
//TODO
export default async function messageRoutes(server: FastifyInstance) {
  server.post("/dm", async (req, reply) => {
    try {
      const { sender_id, receiver_id, content } = req.body as {
        sender_id: number;
        receiver_id: number;
        content: string
      };
      if (sender_id === receiver_id)
        return reply.status(400).send({ 
          status: "failed",
          message: "sender and receiver id shouldn't be the same"
        });
      await newDirectMessage(sender_id, receiver_id, content);
      
      // ... reste du code WebSocket
      
      return reply.status(200).send({
        status: "success",
        message: "message successfully sent"
      });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({
        status: "failure",
        message: "Internal server error."
      });
    }
  });
}