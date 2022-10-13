/*
  Warnings:

  - You are about to drop the column `price` on the `billstopay` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "billstopay" DROP COLUMN "price",
ADD COLUMN     "price_approved" DECIMAL(65,30),
ADD COLUMN     "price_updated" DECIMAL(65,30);
