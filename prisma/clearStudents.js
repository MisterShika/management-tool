import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.student.deleteMany(); // deletes all rows
  console.log('All students cleared!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });