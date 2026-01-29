import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'; // mes instances, l'équivalent de mon .h, je vois pour le réduire au max
import fastifyJwt from '@fastify/jwt'; // JWT
import fp from 'fastify-plugin'; // Me sert à créer des plugins pour mon code, ce qui me permet de l'utiliser partout de façon propre

async function authPlugin(server: FastifyInstance) {
  await server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'fallback-secret', //faudra remplacer cette ligne plus tard pour que ça s'accord au front, je te laisse gérer
    sign: {                   //signe le token, la signature, c'est tout ce dont à besoin le serveur pour reconnaître le token et l'utilisateur
      expiresIn: '7d',   // expire au bout de 7j
      algorithm: 'HS256'       // le type de cryptage, entièrement proposé par l'ia, si tu veux le bouger libre à toi      
    }, 
    verify: {
      algorithms: ['HS256']           // premier check de la signature, si ce n'est pas HS256, dans ce cas, ce n'est pas un token que j'ai fourni
    }
  });

  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => { // 'décore' mon serveur d'une fonction 'authenticate', pour qu'elle soit partout, je l'utilise pour vérifier le token à chaque route protégé
    try {
      await request.jwtVerify(); // Check la signature du token
    } catch (err) {
      reply.code(401).send({ error: 'Invalid Token' }); // et si ce n'est pas un bon token
    }
  });
}

/*
2 façons de gérer les tokens :
1 : un seul token (ce que je fais actuellement), manière suffisante pour transcendance mais pas complète, et on a pas accès nous même au token, on se réfère à la signature et il est stocker chez l'utilisateur
2 : Refresh et access token, façon clean, un token logue durée (refresh) et l'autre courte durée qu'on refresh avec le premier, on peut partir là dessus mais faudra bouger la db, ça me dérange pas.
Je te laisse décider de ce que tu préfères
*/
/*

EXEMPLE D'UTILISATION d'AUTHENTICATE (ce que je fais ligne 17)
logout sert quasi à rien vu que actuellement c'est le front qui delete le token dans le localstorage

server.post('/logout', {
  onRequest: [server.authenticate]                   //Premier hook executé par fastify, et appel authenticate, si c'est bon ça continu, sinon ça tombe dans l'erreur ligne 21
}, async (request, reply) => {
  return { 
    success: true, 
    message: 'Déconnexion réussie' 
  };
});
*/

// Petite info supplémentaire
/*
Voici le module que j'ai dans mon serveur.ts, donc il me permet de récupérer l'id et l'email dans chaque requête où traine le token
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number
      email: string
    }
  }
}*/

export default fp(authPlugin); // exporte le plugin