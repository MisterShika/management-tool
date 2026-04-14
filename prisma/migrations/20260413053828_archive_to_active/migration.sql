/*
  Warnings:

  - You are about to drop the column `isArchive` on the `Lesson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "isArchive",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
