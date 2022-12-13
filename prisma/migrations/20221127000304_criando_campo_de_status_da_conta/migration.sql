-- DropForeignKey
ALTER TABLE "purchaserequestbudgets" DROP CONSTRAINT "purchaserequestbudgets_unit_id_fkey";

-- AlterTable
ALTER TABLE "billstopay" ADD COLUMN     "bill_status" TEXT;

-- AlterTable
ALTER TABLE "purchaserequestbudgets" ALTER COLUMN "unit_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "purchaserequestbudgets" ADD CONSTRAINT "purchaserequestbudgets_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;
