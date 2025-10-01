import { prisma } from "../lib/prisma.js";

// Finds a user by their userCode
export async function findUserByCode(userCode) {
  return await prisma.user.findUnique({
    where: { userCode },
    select: {
      id: true,
      access: true,
      pin: true,
    },
  });
}