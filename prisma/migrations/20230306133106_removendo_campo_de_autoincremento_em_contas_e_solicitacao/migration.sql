/*
  Warnings:

  - You are about to drop the column `identifier` on the `billstopay` table. All the data in the column will be lost.
  - You are about to drop the column `identifier` on the `purchaserequests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "billstopay" DROP COLUMN "identifier";

-- AlterTable
ALTER TABLE "purchaserequests" DROP COLUMN "identifier";
