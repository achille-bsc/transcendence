import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import fastifyJwt from '@fastify/jwt';
import { prisma } from '../prisma'
import { getProfile } from './routes/auth'
import { hashPassword } from './utils/hashing'

const server = fastify({ logger: true })

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number
      email: string
    }
  }
}

interface ISignin {
  pseudo: string;
  email: string;
  password: string;
}

interface ILogin {
  log_name: string;
  password: string;
}


await server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'fallback-secret',
  sign: {
    expiresIn: '7d',
    algorithm: 'HS256'
  },
  verify: {
    algorithms: ['HS256']
  }
});


server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Non authentifié' });
  }
});


server.post<{ Body: ISignin }>('/signin', async (request, reply) => {
  const { pseudo, email, password } = request.body;
  
  if (!pseudo || !email || !password) {
    return reply.code(400).send({ error: 'Tous les champs sont requis' });
  }
  
  if (password.length < 8) {
    return reply.code(400).send({ error: 'Le mot de passe doit faire au moins 8 caractères' });
  }
  
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { pseudo },
        { email }
      ]
    }
  });
  
  if (existing) {
    return reply.code(409).send({ error: 'Pseudo ou email déjà utilisé' });
  }
  
  const hashedPassword = await hashPassword(password);
  
  const user = await prisma.user.create({
    data: {
      pseudo,
      email,
      password: hashedPassword
    },
    select: {
      id: true,
      pseudo: true,
      email: true
    }
  });
  
  // Générer le token
  const token = server.jwt.sign({
    id: user.id,
    email: user.email
  });
  
  return {
    success: true,
    user,
    token
  };
});

// POST /login - Connexion
server.post<{ Body: ILogin }>('/login', async (request, reply) => {
  const { log_name, password } = request.body;
  
  // Vérifier les identifiants
  const user = await getProfile(log_name, password, reply);
  
  if (!user) {
    return; // getProfile a déjà envoyé la réponse d'erreur
  }
  
  // Générer le token
  const token = server.jwt.sign({
    id: user.id,
    email: user.email
  });
  
  return {
    success: true,
    user: {
      id: user.id,
      pseudo: user.pseudo,
      email: user.email
    },
    token
  };
});


server.get('/checktoken', {
  onRequest: [server.authenticate]
}, async (request, reply) => {
  reply.code(200).send({ success: true });
  return ;
});

server.get('/profile', {
  onRequest: [server.authenticate]
}, async (request, reply) => {
  const userId = request.user.id;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      pseudo: true,
      email: true
    }
  });
  
  if (!user) {
    return reply.code(404).send({ error: 'Utilisateur non trouvé' });
  }
  
  return { user };
});


server.post('/logout', {
  onRequest: [server.authenticate]
}, async (request, reply) => {
  return { 
    success: true, 
    message: 'Déconnexion réussie' 
  };
});

// ========== START SERVER ==========
server.listen({ port: 7979 }, (err, address) => {
  console.log("Starting server...");
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});