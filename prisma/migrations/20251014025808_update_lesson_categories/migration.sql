-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('FREE', 'MINECRAFT', 'SCRATCH', 'INDEPENDENT', 'OTHER');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "type" "LessonType" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "url" TEXT;
