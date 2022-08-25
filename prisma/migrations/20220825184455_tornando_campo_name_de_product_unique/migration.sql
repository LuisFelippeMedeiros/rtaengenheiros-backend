/*
  Warnings:

  - You are about to drop the column `category_id` on the `purchaserequests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "purchaserequests" DROP CONSTRAINT "purchaserequests_category_id_fkey";

-- AlterTable
ALTER TABLE "purchaserequests" DROP COLUMN "category_id";

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");
