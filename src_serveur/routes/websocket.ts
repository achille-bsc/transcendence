import { FastifyInstance } from 'fastify';

const clients = new Set<any>();
export default async function websocketRoutes(server: FastifyInstance) {
	server.register(async function (server) {
	server.get('/ws', { websocket: true }, (socket, req) => {
		
		// Quand un client se connecte
		clients.add(socket);
		console.log('Client connecté. Total:', clients.size);

		// Quand un client se déconnecte
		socket.on('close', () => {
		clients.delete(socket);
		console.log('Client déconnecté. Total:', clients.size);
		});
	});
	});
}