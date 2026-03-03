import { FastifyInstance } from 'fastify';
import { createUser, checkSignin, checkLogin } from './src/utils/utils_register';
import { hashPassword, comparePassword } from './src/utils/hashing';

async function authRoutes(server: FastifyInstance) {
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

export default authRoutes;


import { FastifyInstance } from 'fastify';
// ATTENTION : Ces fonctions vont devoir être réécrites. 
// Elles ne peuvent plus faire d'appels à la base de données directement.
// Tu devras utiliser fetch() pour contacter http://database-service:5000 
// en utilisant ton fameux "Backend Pass" en en-tête.
import { createUser, checkSignin, checkLogin } from '../utils/utils_register';

async function authRoutes(server: FastifyInstance) {
  server.post('/signin', async (request, reply) => {
    const { pseudo, email, password } = request.body as any;
    
    if (!await checkSignin(pseudo, email, password, reply)) return;
    
    const user = await createUser(pseudo, email, password, reply);
    if (!user) return;

    const token = server.jwt.sign({ pseudo: user.pseudo });
    return { success: true, user, token };
  });

  server.post('/login', async (request, reply) => {
    const { log_name, password } = request.body as any;
    
    const user = await checkLogin(log_name, password, reply);
    if (!user) return; 
    
    const token = server.jwt.sign({ pseudo: user.pseudo });
    return { success: true, user: { pseudo: user.pseudo }, token };
  });

  // Cette route fonctionne car le plugin local (Fichier 1) fournit server.authenticate
  server.post('/logout', {
    onRequest: [server.authenticate]
  }, async (request, reply) => {
    return { success: true, message: 'Logout successful' };
  });
}

