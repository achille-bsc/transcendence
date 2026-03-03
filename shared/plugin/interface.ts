import 'fastify';

export interface JwtPayload {
  pseudo: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload;
  }
}