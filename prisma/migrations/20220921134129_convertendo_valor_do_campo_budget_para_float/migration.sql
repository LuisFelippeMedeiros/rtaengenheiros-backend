/*
  Warnings:

  - You are about to alter the column `budget` on the `purchaserequestbudgets` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "billstopay" ALTER COLUMN "type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "purchaserequestbudgets" ALTER COLUMN "budget" DROP NOT NULL,
ALTER COLUMN "budget" SET DATA TYPE DOUBLE PRECISION;
