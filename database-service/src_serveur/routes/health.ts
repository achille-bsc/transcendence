import { FastifyInstance } from 'fastify';
import { prisma } from '../../prisma';
import { hashPassword } from '../utils/hashing';
import { findUserById } from '../utils/utils_user';

export default async function healthRoutes(server: FastifyInstance) {
  server.get('/health', async () => {
    const tester = await prisma.user.create({
      data: {
        pseudo: 'healthcheck',
        email: 'healthcheck@test.com',
        password: await hashPassword('healthcheckpassword'),
      },
    });
    if (!tester)
      return { status: 'error' };
    const test = await prisma.user.findFirst({ where: { id: tester.id } });
    if (test!.pseudo !== 'healthcheck')
      return { status: 'error' };
    if (test!.id !== tester.id)
      return { status: 'error' };
    await prisma.user.deleteMany({ where: { id: tester.id } });
    for (let i = 1; i <= 10; i++)
    { 
      let tmp;
      tmp = await findUserById(i)
     console.log("Supertest :", i, tmp);
    }
    return { status: 'ok' };
  });
}