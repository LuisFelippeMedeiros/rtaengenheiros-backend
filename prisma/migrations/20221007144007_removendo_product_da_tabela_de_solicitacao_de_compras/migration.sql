/*
  Warnings:

  - You are about to drop the column `product_id` on the `purchaserequests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "purchaserequests" DROP CONSTRAINT "purchaserequests_product_id_fkey";

-- AlterTable
ALTER TABLE "purchaserequests" DROP COLUMN "product_id";
