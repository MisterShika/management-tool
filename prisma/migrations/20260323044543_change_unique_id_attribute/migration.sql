/*
  Warnings:

  - A unique constraint covering the columns `[studentId,lessonId,visitId]` on the table `LessonCompletion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."LessonCompletion_lessonId_studentId_key";

-- CreateIndex
CREATE UNIQUE INDEX "LessonCompletion_studentId_lessonId_visitId_key" ON "LessonCompletion"("studentId", "lessonId", "visitId");
