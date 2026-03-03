import { FastifyInstance } from 'fastify';
import { createUser, checkSignin, checkLogin } from './utils/utils_register';
import { hashPassword, comparePassword } from './utils/hashing';
import { prisma } from '../database-service/prisma'

export default async function authRoutes(server: FastifyInstance) {
  server.post('/signin', async (request, reply) => {
    const { pseudo, email, password } = request.body as {
		pseudo: string,
		email: string,
		password: string };
    if (!await checkSignin(pseudo, email, password, reply))
      return;
    const user = await createUser(pseudo, email, password, reply);
    const token = server.jwt.sign({
      pseudo: user.pseudo,
    });
    return { success: true, user, token };
  });

  server.post('/login', async (request, reply) => {
    const { log_name, password } = request.body as {
		log_name: string,
		password: string
	};
    const user = await checkLogin(log_name, password, reply);
    if (!user)
      return; 
    const token = server.jwt.sign({
      pseudo: user.pseudo,
    });
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