import { FastifyInstance } from 'fastify';

export default async function inviteRoutes(server: FastifyInstance) {
    server.post("/invite", async (req, reply) =>{
    const { sender_id, user_id } = req.body as {
        sender_id: number;
        user_id: number;
        };
        if (sender_id === user_id)
        {
            console.log("User cannot invite itself");
            return {
            status: "failure",
            message: "You cannot invite yourself."};
        }
            //handle invite properly here
        return { status: "success", message: "User unblocked." };   
        });
}