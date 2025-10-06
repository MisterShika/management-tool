// prisma/seed.js
import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const users = [
  {
    firstName: '愛子',
    firstNameFurigana: 'あいこ',
    lastName: '田中',
    lastNameFurigana: 'たなか',
    userCode: '1234',
    pin: '1234',
    access: 'ADMIN',
  },
  {
    firstName: '太郎',
    firstNameFurigana: 'たろう',
    lastName: '佐藤',
    lastNameFurigana: 'さとう',
    userCode: '5678',
    pin: '5678',
    access: 'STAFF',
  },
  {
    firstName: '一郎',
    firstNameFurigana: 'いちろう',
    lastName: '山田',
    lastNameFurigana: 'やまだ',
    userCode: '9012',
    pin: '9012',
    access: 'STAFF',
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
