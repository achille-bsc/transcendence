import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import fastifyJwt from '@fastify/jwt';
import { prisma } from '../prisma'
import { getProfile } from './routes/auth'
import { hashPassword } from './utils/hashing'
import cors from "@fastify/cors";
import { createUser, signinValidations } from './routes/signin';
import { newMessage } from '../src/direct_message';
import test from 'node:test';

const server = fastify({ logger: true })

await server.register(cors, {
  origin: true,
});


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
  if (!await signinValidations(pseudo, email, password, reply))
    return;
  const user = await createUser(pseudo, email, password, reply);
  const token = server.jwt.sign({
    id: user.id,
    email: user.email
  });
  return { success: true, user, token };
});


server.post<{ Body: ILogin }>('/login', async (request, reply) => {
  const { log_name, password } = request.body;
  const user = await getProfile(log_name, password, reply);
  if (!user)
    return; 
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

server.post("/dm", async (req, reply) =>{
  try {
      const { sender_id, receiver_id, content } = req.body as {
          sender_id: number;
          receiver_id: number;
          content: string
      };
      if (sender_id === receiver_id)
        return reply.status(400).send({ status: "success",
                message: "sender and receiver id shouldn't be the same"});
      await newMessage(sender_id, receiver_id, content);
      
      const blockedRows = await db.all(
                "SELECT blocker_id FROM blocked WHERE blocked_id = ?", sender_id)
            const blockedBy = blockedRows.map((row) => String(row.blocker_id));
            for (const [ws, id] of clients)
            {
                if (!blockedBy.includes(String(receiver_id)) && id === receiver_id)
                    ws.send(JSON.stringify({type: "message", sender: sender_id, content: content}));
                if (id === sender_id)
                    ws.send(JSON.stringify({type: "message", sender: sender_id, content: content}));
            }
            return reply.status(200).send({
                status: "success",
                message: "message successfully sent"});
        }
        catch (err)
        {
            console.error(err);
            return reply.status(500).send({
                status: "failure",
                message: "Internal server error."});
        }
    });

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

server.get('/health', async () => {
  const tester = await prisma.user.create({
    data: {
      pseudo: 'healthcheck',
      email: '<EMAIL>',
      password: await hashPassword('healthcheckpassword'),
    },
  });
  if (!tester)
    return { status: 'error' };
  const test = await prisma.user.findFirst( { where: { id: tester.id } } );
  if (test!.pseudo !== 'healthcheck')
    return { status: 'error' };
  if (test!.id !== tester.id)
    return { status: 'error' };
  await prisma.user.deleteMany({ where: { id: tester.id } });
  return { status: 'ok' };
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
      email: true,
      createdAt: true,
      lastLoginAt: true,
    }
  });
  if (!user)
    return reply.code(404).send({ error: 'Utilisateur non trouvé' });
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
  if (err)
  {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});