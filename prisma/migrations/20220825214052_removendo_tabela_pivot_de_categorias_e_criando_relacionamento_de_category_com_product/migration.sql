/*
  Warnings:

  - You are about to drop the `categoriesproduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categoriesproduct" DROP CONSTRAINT "categoriesproduct_category_id_fkey";

-- DropForeignKey
ALTER TABLE "categoriesproduct" DROP CONSTRAINT "categoriesproduct_product_id_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "category_id" TEXT;

-- DropTable
DROP TABLE "categoriesproduct";

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
