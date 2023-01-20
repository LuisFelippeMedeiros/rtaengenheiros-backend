/*
  Warnings:

  - You are about to drop the column `company_id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `status` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_company_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_company_id_fkey";

-- DropForeignKey
ALTER TABLE "status" DROP CONSTRAINT "status_company_id_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "company_id";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "company_id";

-- AlterTable
ALTER TABLE "status" DROP COLUMN "company_id";
