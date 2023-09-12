/*
  Warnings:

  - You are about to drop the column `purchaseorderproduct_id` on the `purchaseorders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_fee` on the `purchaseorders` table. All the data in the column will be lost.
  - You are about to drop the `_PurchaseOrderToPurchaseRequest` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[identifier]` on the table `purchaseorders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `purchaseorder_id` to the `purchaseorderproducts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PurchaseOrderToPurchaseRequest" DROP CONSTRAINT "_PurchaseOrderToPurchaseRequest_A_fkey";

-- DropForeignKey
ALTER TABLE "_PurchaseOrderToPurchaseRequest" DROP CONSTRAINT "_PurchaseOrderToPurchaseRequest_B_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_purchaseorderproduct_id_fkey";

-- DropForeignKey
ALTER TABLE "purchaseorders" DROP CONSTRAINT "purchaseorders_purchaseorderproduct_id_fkey";

-- AlterTable
ALTER TABLE "purchaseorderproducts" ADD COLUMN     "product_id" TEXT,
ADD COLUMN     "purchaseorder_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "purchaseorders" DROP COLUMN "purchaseorderproduct_id",
DROP COLUMN "shipping_fee",
ADD COLUMN     "identifier" SERIAL,
ADD COLUMN     "purchaserequest_id" TEXT;

-- DropTable
DROP TABLE "_PurchaseOrderToPurchaseRequest";

-- CreateIndex
CREATE UNIQUE INDEX "purchaseorders_identifier_key" ON "purchaseorders"("identifier");

-- AddForeignKey
ALTER TABLE "purchaseorders" ADD CONSTRAINT "purchaseorders_purchaserequest_id_fkey" FOREIGN KEY ("purchaserequest_id") REFERENCES "purchaserequests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchaseorderproducts" ADD CONSTRAINT "purchaseorderproducts_purchaseorder_id_fkey" FOREIGN KEY ("purchaseorder_id") REFERENCES "purchaseorders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchaseorderproducts" ADD CONSTRAINT "purchaseorderproducts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
