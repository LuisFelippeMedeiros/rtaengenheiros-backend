/*
  Warnings:

  - A unique constraint covering the columns `[billtopay_id]` on the table `purchaseorders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "purchaseorders" ADD COLUMN     "billtopay_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "purchaseorders_billtopay_id_key" ON "purchaseorders"("billtopay_id");

-- AddForeignKey
ALTER TABLE "purchaseorders" ADD CONSTRAINT "purchaseorders_billtopay_id_fkey" FOREIGN KEY ("billtopay_id") REFERENCES "billstopay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
