/*
  Warnings:

  - A unique constraint covering the columns `[lessonId,visitId]` on the table `LessonCompletion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LessonCompletion_lessonId_visitId_key" ON "LessonCompletion"("lessonId", "visitId");
