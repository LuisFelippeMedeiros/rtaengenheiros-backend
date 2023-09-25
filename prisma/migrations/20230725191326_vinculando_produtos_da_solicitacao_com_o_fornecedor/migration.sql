-- AlterTable
ALTER TABLE "purchaserequestproducts" ADD COLUMN     "supplier_id" TEXT;

-- AddForeignKey
ALTER TABLE "purchaserequestproducts" ADD CONSTRAINT "purchaserequestproducts_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
