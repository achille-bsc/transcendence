import { FastifyInstance } from 'fastify';
import { prisma } from '../../prisma';
import { hashPassword } from '../utils/hashing';

export default async function healthRoutes(server: FastifyInstance) {
  server.get('/health', async () => {
    if (!prisma) {
      return { status: 'error' };
    }
    const dbStatus = await prisma.user.findFirst(
      {
        where : {pseudo : 'healt@hcheck'}
      }
    );
    if (dbStatus) {
      await prisma.user.deleteMany({ where: { pseudo: 'healt@hcheck' } });
    }
    const tester = await prisma.user.create({
      data: {
        pseudo: 'healt@hcheck',
        email: 'healthchecktest.com',
        password: await hashPassword('healthcheckpassword'),
      },
    });
    if (!tester)
      return { status: 'error' };
    const test = await prisma.user.findFirst({ where: { id: tester.id } });
    if (test!.pseudo !== 'healt@hcheck')
      return { status: 'error' };
    if (test!.id !== tester.id)
      return { status: 'error' };
    await prisma.user.deleteMany({ where: { id: tester.id } });
    return { status: 'ok' };
  });
}