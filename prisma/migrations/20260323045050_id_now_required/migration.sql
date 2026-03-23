/*
  Warnings:

  - Made the column `studentId` on table `LessonCompletion` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."LessonCompletion" DROP CONSTRAINT "LessonCompletion_studentId_fkey";

-- AlterTable
ALTER TABLE "LessonCompletion" ALTER COLUMN "studentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "LessonCompletion" ADD CONSTRAINT "LessonCompletion_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
