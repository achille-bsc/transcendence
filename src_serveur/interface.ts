import { FastifyRequest, FastifyReply } from 'fastify';

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

export interface ISignin {
  pseudo: string;
  email: string;
  password: string;
}

export interface ILogin {
  log_name: string;
  password: string;
}