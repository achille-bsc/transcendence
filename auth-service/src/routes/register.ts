import { FastifyInstance } from 'fastify';
import { checkSignin, hashPassword, comparePassword } from '../utils/utils_register';
import fs from 'fs';

try {
  fs.accessSync('/run/secrets/api_pass', fs.constants.R_OK);
} catch (err) {
  console.error("Error: Unable to read API password from /run/secrets/api_pass. Please ensure the file exists and has the correct permissions.");
  process.exit(1);
}
const api_pass = fs.readFileSync('/run/secrets/api_pass', 'utf-8').trim();

async function authRoutes(server: FastifyInstance) {
  server.post('/signin', async (request, reply) => {
    const { pseudo, email, password } = request.body as {
		pseudo: string,
		email: string,
		password: string };
    if (!await checkSignin(pseudo, email, password, reply))
      return;
    const hashedPassword = await hashPassword(password);
    const res = await fetch("/api/db/createuser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
        'x-backend-pass': api_pass
			},
			body: JSON.stringify({
				pseudo: pseudo,
				email: email,
				password: hashedPassword,
			}),
		});
    const data = await res.json();
    if (!res.ok)
      return reply.code(400).send({ error: data.error }); 
    const token = server.jwt.sign({ pseudo: pseudo });
    return { success: true, pseudo: data.pseudo, token };
  });

  server.post('/login', async (request, reply) => {
    const { log_name, password } = request.body as {
		log_name: string,
		password: string
	};
    const res = await fetch("/api/db/finduser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
        'x-backend-pass': 'ton_super_secret'
			},
			body: JSON.stringify({
				log_name: log_name,
				password: password
			}),
		});
    if (!res.ok) {
      const data = await res.json();
      return reply.code(400).send({ error: data.error });
    }
    const user = await res.json();
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return reply.code(400).send({ error: 'Invalid Password' });
    }
    const token = server.jwt.sign({ pseudo: user.pseudo });
    return {
      success: true,
      user: {pseudo: user.pseudo},
      token
    };
  });

  server.post('/logout', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    return { 
      success: true, 
      message: 'Logout successful' 
    };
  });
}

export default authRoutes;