// prisma/studentSeed.js
import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const students = [
    {
      firstName: '陽菜',
      firstNameFurigana: 'ひな',
      lastName: '高橋',
      lastNameFurigana: 'たかはし',
      birthday: new Date('2012-05-14'),
      address: '東京都新宿区西新宿1-1-1',
      school: '新宿小学校',
      schoolType: 'ELEMENTARY',
      grade: '6',
      gender: 'FEMALE',
    },
    {
      firstName: '颯太',
      firstNameFurigana: 'そうた',
      lastName: '鈴木',
      lastNameFurigana: 'すずき',
      birthday: new Date('2011-08-22'),
      address: '東京都渋谷区神南2-2-2',
      school: '渋谷中学校',
      schoolType: 'MIDDLE',
      grade: '1',
      gender: 'MALE',
    },
    {
      firstName: '美咲',
      firstNameFurigana: 'みさき',
      lastName: '中村',
      lastNameFurigana: 'なかむら',
      birthday: new Date('2013-01-30'),
      address: '東京都世田谷区北沢3-3-3',
      school: '世田谷小学校',
      schoolType: 'ELEMENTARY',
      grade: '5',
      gender: 'FEMALE',
    },
    {
      firstName: '大翔',
      firstNameFurigana: 'ひろと',
      lastName: '伊藤',
      lastNameFurigana: 'いとう',
      birthday: new Date('2012-11-10'),
      address: '東京都目黒区中町4-4-4',
      school: '目黒小学校',
      schoolType: 'ELEMENTARY',
      grade: '6',
      gender: 'MALE',
    },
    {
      firstName: '凛',
      firstNameFurigana: 'りん',
      lastName: '佐々木',
      lastNameFurigana: 'ささき',
      birthday: new Date('2011-07-05'),
      address: '東京都豊島区南池袋5-5-5',
      school: '池袋高校',
      schoolType: 'HIGH',
      grade: '2',
      gender: 'UNSPECIFIED',
    },
  ];

  await prisma.student.createMany({
    data: students,
    skipDuplicates: true, // optional
  });

  console.log('Dummy student data with schoolType inserted!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
