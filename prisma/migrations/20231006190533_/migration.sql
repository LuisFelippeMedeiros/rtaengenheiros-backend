-- AlterTable
ALTER TABLE "purchaseorders" ADD COLUMN     "company_id" TEXT;

-- AddForeignKey
ALTER TABLE "purchaseorders" ADD CONSTRAINT "purchaseorders_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
