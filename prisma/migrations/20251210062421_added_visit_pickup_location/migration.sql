-- CreateEnum
CREATE TYPE "PickUpLocation" AS ENUM ('NONE', 'SCHOOL', 'HOME');

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "pickUpLoc" "PickUpLocation" NOT NULL DEFAULT 'NONE';
