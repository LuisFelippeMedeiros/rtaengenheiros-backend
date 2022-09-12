/*
  Warnings:

  - You are about to drop the column `quantity` on the `purchaserequests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "purchaserequestbudgets" ADD COLUMN     "quantity" TEXT;

-- AlterTable
ALTER TABLE "purchaserequests" DROP COLUMN "quantity";
