// prisma/seed.js
import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const users = [
  {
    firstName: 'カイル',
    firstNameFurigana: 'カイル',
    lastName: 'ウィルツ',
    lastNameFurigana: 'ウィルツ',
    userCode: 'KW86',
    pin: 'CM11',
    access: 'ADMIN',
  },
];

  for (const user of users) {
    // upsert is safer to avoid duplicate errors if you re-run seed
    await prisma.user.upsert({
      where: { userCode: user.userCode },
      update: {},
      create: user,
    });
  }

  console.log('Seed data inserted!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
