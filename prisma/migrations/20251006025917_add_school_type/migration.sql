-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('ELEMENTARY', 'MIDDLE', 'HIGH', 'OTHER');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "schoolType" "SchoolType";
