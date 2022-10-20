/*
  Warnings:

  - You are about to drop the column `approved_at` on the `purchaserequests` table. All the data in the column will be lost.
  - You are about to drop the column `approved_by` on the `purchaserequests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "purchaserequests" DROP COLUMN "approved_at",
DROP COLUMN "approved_by",
ADD COLUMN     "approveddiretor_at" TIMESTAMP(3),
ADD COLUMN     "approveddiretor_by" TEXT,
ADD COLUMN     "approvedgestor_at" TIMESTAMP(3),
ADD COLUMN     "approvedgestor_by" TEXT;
