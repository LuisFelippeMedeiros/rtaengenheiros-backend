/*
  Warnings:

  - You are about to drop the column `purchaserequest_id` on the `billstopay` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "billstopay" DROP COLUMN "purchaserequest_id",
ADD COLUMN     "purchaserequest_identifier" INTEGER;

-- AddForeignKey
ALTER TABLE "billstopay" ADD CONSTRAINT "billstopay_purchaserequest_identifier_fkey" FOREIGN KEY ("purchaserequest_identifier") REFERENCES "purchaserequests"("identifier") ON DELETE SET NULL ON UPDATE CASCADE;
