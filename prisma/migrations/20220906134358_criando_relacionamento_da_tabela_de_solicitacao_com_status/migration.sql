/*
  Warnings:

  - You are about to drop the column `status` on the `purchaserequests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "purchaserequests" DROP COLUMN "status",
ADD COLUMN     "status_id" TEXT;

-- AddForeignKey
ALTER TABLE "purchaserequests" ADD CONSTRAINT "purchaserequests_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
