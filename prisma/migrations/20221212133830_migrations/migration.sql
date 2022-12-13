/*
  Warnings:

  - You are about to drop the column `authorized` on the `billstopay` table. All the data in the column will be lost.
  - You are about to drop the column `invoice` on the `billstopay` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "billstopay" DROP COLUMN "authorized",
DROP COLUMN "invoice";
