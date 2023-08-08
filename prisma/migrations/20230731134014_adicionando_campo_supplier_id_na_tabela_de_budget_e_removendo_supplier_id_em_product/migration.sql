/*
  Warnings:

  - You are about to drop the column `supplier_id` on the `purchaserequestproducts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "purchaserequestproducts" DROP CONSTRAINT "purchaserequestproducts_supplier_id_fkey";

-- AlterTable
ALTER TABLE "purchaserequestbudgets" ADD COLUMN     "product_id" TEXT;

-- AlterTable
ALTER TABLE "purchaserequestproducts" DROP COLUMN "supplier_id";

-- AddForeignKey
ALTER TABLE "purchaserequestbudgets" ADD CONSTRAINT "purchaserequestbudgets_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
