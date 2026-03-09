import { FastifyInstance } from 'fastify';
import fs from 'fs';

try {
  fs.accessSync('/run/secrets/api_pass', fs.constants.R_OK);
} catch (err) {
  console.error("Error: Unable to read API password from /run/secrets/api_pass. Please ensure the file exists and has the correct permissions.");
  process.exit(1);
}
const api_pass = fs.readFileSync('/run/secrets/api_pass', 'utf-8').trim();

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

  server.post("/find-dm", {
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
    const res = await fetch("/api/db/find-dm", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
        'x-backend-pass': api_pass
			},
			body: JSON.stringify({
				user1Pseudo: senderPseudo,
				user2Pseudo: receiverPseudo,
				options: { beforeId: parsedBeforeId, limit: parsedLimit }
			}),
		});
    const data = await res.json();
    if (!res.ok)
      return reply.code(400).send({ error: data.error }); 
    return { status: "success", message: "Conversation found.", data: data };
  });
}