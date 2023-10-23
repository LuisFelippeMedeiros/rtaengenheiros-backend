-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "address" TEXT,
ADD COLUMN     "telephone" TEXT,
ADD COLUMN     "zip_code" TEXT;

-- AlterTable
ALTER TABLE "purchaseorders" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
