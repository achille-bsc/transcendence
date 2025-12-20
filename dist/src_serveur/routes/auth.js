import { findProfile } from '../../src/script';
export async function handleGetProfile(mail, reply) {
    const user = await findProfile(mail);
    if (!user) {
        reply.code(404).send({ error: 'User not found' });
        return;
    }
    else {
        console.log('User found:', user);
        return user;
    }
}
