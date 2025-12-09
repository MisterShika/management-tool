-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "studentLat" TEXT,
ADD COLUMN     "studentLon" TEXT,
ALTER COLUMN "firstNameFurigana" DROP NOT NULL,
ALTER COLUMN "lastNameFurigana" DROP NOT NULL,
ALTER COLUMN "grade" DROP NOT NULL;
