-- AlterTable
ALTER TABLE "billstopay" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "company_id" TEXT,
ADD COLUMN     "identifier" SERIAL NOT NULL;

-- AddForeignKey
ALTER TABLE "billstopay" ADD CONSTRAINT "billstopay_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
