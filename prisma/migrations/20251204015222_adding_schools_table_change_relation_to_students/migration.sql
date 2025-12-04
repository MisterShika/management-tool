-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "addressLat" TEXT,
ADD COLUMN     "addressLon" TEXT;

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "schoolName" TEXT NOT NULL,
    "schoolAddress" TEXT NOT NULL,
    "schoolLat" TEXT,
    "schoolLon" TEXT,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);
