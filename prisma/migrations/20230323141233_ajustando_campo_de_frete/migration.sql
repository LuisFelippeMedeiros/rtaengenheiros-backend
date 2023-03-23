/*
  Warnings:

  - You are about to drop the column `shipping_fee` on the `purchaserequests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "purchaserequestbudgets" ADD COLUMN     "shipping_fee" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "purchaserequests" DROP COLUMN "shipping_fee";
