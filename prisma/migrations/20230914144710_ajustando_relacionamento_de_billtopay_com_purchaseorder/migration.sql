/*
  Warnings:

  - The `billtopay_id` column on the `purchaseorders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[identifier]` on the table `billstopay` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "purchaseorders" DROP CONSTRAINT "purchaseorders_billtopay_id_fkey";

-- AlterTable
ALTER TABLE "purchaseorders" DROP COLUMN "billtopay_id",
ADD COLUMN     "billtopay_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "billstopay_identifier_key" ON "billstopay"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "purchaseorders_billtopay_id_key" ON "purchaseorders"("billtopay_id");

-- AddForeignKey
ALTER TABLE "purchaseorders" ADD CONSTRAINT "purchaseorders_billtopay_id_fkey" FOREIGN KEY ("billtopay_id") REFERENCES "billstopay"("identifier") ON DELETE SET NULL ON UPDATE CASCADE;
