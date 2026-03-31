-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isDriver" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "driverId" INTEGER;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
