import { prisma } from '../prisma'

export async function deleteRelation(first_id: number, second_id: number)
{
  await prisma.friend.deleteMany({
    where: {
      OR: [
        { userId: first_id, friendId: second_id },
        { userId: second_id, friendId: first_id }
      ],
    },
  })
}

async function acceptRelation(first_id: number, second_id: number)
{
  await prisma.friend.updateMany({
    where: {
      OR: [
        { userId: first_id, friendId: second_id },
        { userId: second_id, friendId: first_id }
      ],
    },
    data: {
      status: "ACCEPTED"
    },
  })
}

export async function createFriendship(userID: number, friendID: number)
{
  if (userID === friendID)
    return
  const relation = await prisma.friend.findFirst({where: { userId: userID, friendId: friendID }})
  if (relation)
  {
    if (relation.status === "SENT" || relation.status === "ACCEPTED")
      return ;
    await acceptRelation(userID, friendID);
    return ;
  }
  const sentfriendship = await prisma.friend.create({
    data: {
      userId: userID,
      friendId: friendID,
      status: "SENT"
    },
  });
  const receptfriendship = await prisma.friend.create({
    data: {
      userId: friendID,
      friendId: userID,
      status: "PENDING"
    },
  });
  await prisma.user.update({
    where: { id : userID },
    data: {
      friend: {
        connect: { id: sentfriendship.id },
      },
    },
  });
  await prisma.user.update({
    where: { id : friendID },
    data: {
      friend: {
        connect: { id: receptfriendship.id },
      },
    },
  });
}