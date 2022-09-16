/*
  Warnings:

  - You are about to drop the column `city_id` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `state_id` on the `companies` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_city_id_fkey";

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_state_id_fkey";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "company_id" TEXT;

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "city_id",
DROP COLUMN "state_id";

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "company_id" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "company_id" TEXT;

-- AlterTable
ALTER TABLE "purchaserequests" ADD COLUMN     "company_id" TEXT;

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "company_id" TEXT;

-- AlterTable
ALTER TABLE "status" ADD COLUMN     "company_id" TEXT;

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "company_id" TEXT;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchaserequests" ADD CONSTRAINT "purchaserequests_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status" ADD CONSTRAINT "status_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
