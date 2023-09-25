/*
  Warnings:

  - You are about to drop the column `unit_id` on the `purchaserequestbudgets` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "purchaserequestbudgets" DROP CONSTRAINT "purchaserequestbudgets_unit_id_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "unit_id" TEXT;

-- AlterTable
ALTER TABLE "purchaserequestbudgets" DROP COLUMN "unit_id";

-- CreateTable
CREATE TABLE "productprices" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productprices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productprices" ADD CONSTRAINT "productprices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
