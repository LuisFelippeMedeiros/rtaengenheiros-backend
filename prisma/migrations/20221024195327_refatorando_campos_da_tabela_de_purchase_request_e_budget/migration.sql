/*
  Warnings:

  - You are about to drop the column `approveddiretor_at` on the `purchaserequestbudgets` table. All the data in the column will be lost.
  - You are about to drop the column `approveddiretor_by` on the `purchaserequestbudgets` table. All the data in the column will be lost.
  - You are about to drop the column `approvedgestor_at` on the `purchaserequestbudgets` table. All the data in the column will be lost.
  - You are about to drop the column `approvedgestor_by` on the `purchaserequestbudgets` table. All the data in the column will be lost.
  - You are about to drop the column `rejected_at` on the `purchaserequestbudgets` table. All the data in the column will be lost.
  - You are about to drop the column `rejected_by` on the `purchaserequestbudgets` table. All the data in the column will be lost.
  - You are about to drop the column `status_id` on the `purchaserequestbudgets` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "purchaserequestbudgets" DROP CONSTRAINT "purchaserequestbudgets_status_id_fkey";

-- AlterTable
ALTER TABLE "purchaserequestbudgets" DROP COLUMN "approveddiretor_at",
DROP COLUMN "approveddiretor_by",
DROP COLUMN "approvedgestor_at",
DROP COLUMN "approvedgestor_by",
DROP COLUMN "rejected_at",
DROP COLUMN "rejected_by",
DROP COLUMN "status_id";

-- AlterTable
ALTER TABLE "purchaserequests" ADD COLUMN     "approveddiretor_at" TIMESTAMP(3),
ADD COLUMN     "approveddiretor_by" TEXT,
ADD COLUMN     "approvedgestor_at" TIMESTAMP(3),
ADD COLUMN     "approvedgestor_by" TEXT,
ADD COLUMN     "rejected_at" TIMESTAMP(3),
ADD COLUMN     "rejected_by" TEXT,
ADD COLUMN     "status_id" TEXT;

-- AddForeignKey
ALTER TABLE "purchaserequests" ADD CONSTRAINT "purchaserequests_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
