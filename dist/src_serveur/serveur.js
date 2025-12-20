import fastify from 'fastify';
import { handleGetProfile } from './routes/auth';
const server = fastify();
server.get('/coucou', async (request, reply) => {
    return 'pong\n';
});
server.listen({ port: 7979 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
let user = undefined;
server.get('/auth', {
    preValidation: async (request, reply, done) => {
        // parsing
        // verif api key
        // code
        const { mail } = request.query;
        user = await handleGetProfile(mail, reply);
        if (!user) {
            reply.code(404).send({ error: 'User not found' });
            return;
        }
    }
}, async (request, reply) => {
    const customerHeader = request.headers['h-Custom'];
    console.log(user);
    // do something with request data
    return { success: true };
});
