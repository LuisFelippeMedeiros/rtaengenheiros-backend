/*
  Warnings:

  - You are about to drop the column `approveddiretor_at` on the `purchaserequests` table. All the data in the column will be lost.
  - You are about to drop the column `approveddiretor_by` on the `purchaserequests` table. All the data in the column will be lost.
  - You are about to drop the column `approvedgestor_at` on the `purchaserequests` table. All the data in the column will be lost.
  - You are about to drop the column `approvedgestor_by` on the `purchaserequests` table. All the data in the column will be lost.
  - You are about to drop the column `rejected_at` on the `purchaserequests` table. All the data in the column will be lost.
  - You are about to drop the column `rejected_by` on the `purchaserequests` table. All the data in the column will be lost.
  - You are about to drop the column `status_id` on the `purchaserequests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "purchaserequests" DROP CONSTRAINT "purchaserequests_status_id_fkey";

-- AlterTable
ALTER TABLE "purchaserequestbudgets" ADD COLUMN     "approveddiretor_at" TIMESTAMP(3),
ADD COLUMN     "approveddiretor_by" TEXT,
ADD COLUMN     "approvedgestor_at" TIMESTAMP(3),
ADD COLUMN     "approvedgestor_by" TEXT,
ADD COLUMN     "rejected_at" TIMESTAMP(3),
ADD COLUMN     "rejected_by" TEXT,
ADD COLUMN     "status_id" TEXT,
ADD COLUMN     "to_be_approved" BOOLEAN,
ADD COLUMN     "unit" TEXT;

-- AlterTable
ALTER TABLE "purchaserequests" DROP COLUMN "approveddiretor_at",
DROP COLUMN "approveddiretor_by",
DROP COLUMN "approvedgestor_at",
DROP COLUMN "approvedgestor_by",
DROP COLUMN "rejected_at",
DROP COLUMN "rejected_by",
DROP COLUMN "status_id";

-- AddForeignKey
ALTER TABLE "purchaserequestbudgets" ADD CONSTRAINT "purchaserequestbudgets_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
