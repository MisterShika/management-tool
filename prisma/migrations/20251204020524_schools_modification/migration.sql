/*
  Warnings:

  - You are about to drop the column `school` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `schoolType` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "School" ADD COLUMN     "schoolType" "SchoolType" NOT NULL DEFAULT 'ELEMENTARY';

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "school",
DROP COLUMN "schoolType",
ADD COLUMN     "schoolId" INTEGER;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
