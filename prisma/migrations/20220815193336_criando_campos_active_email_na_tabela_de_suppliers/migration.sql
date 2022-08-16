-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "active" BOOLEAN DEFAULT true,
ADD COLUMN     "agency" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "pix2" TEXT;
