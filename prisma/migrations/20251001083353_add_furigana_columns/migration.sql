/*
  Warnings:

  - Added the required column `firstNameFurigana` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastNameFurigana` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstNameFurigana" TEXT NOT NULL,
ADD COLUMN     "lastNameFurigana" TEXT NOT NULL;
