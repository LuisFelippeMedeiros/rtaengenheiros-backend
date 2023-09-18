/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `billstopay` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "purchaseorders" ALTER COLUMN "identifier" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "billstopay_id_key" ON "billstopay"("id");
