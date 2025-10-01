// prisma/seed.js
import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { firstName: 'Alice', lastName: 'Tanaka', userCode: '1234', pin: '1234', access: 'ADMIN' },
    { firstName: 'Bob', lastName: 'Sato', userCode: '5678', pin: '5678', access: 'STAFF' },
    { firstName: 'Charlie', lastName: 'Yamada', userCode: '9012', pin: '9012', access: 'STAFF' },
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
