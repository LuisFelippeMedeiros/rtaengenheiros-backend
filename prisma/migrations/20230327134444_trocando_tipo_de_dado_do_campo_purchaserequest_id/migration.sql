/*
  Warnings:

  - The `purchaserequest_id` column on the `billstopay` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "billstopay" DROP COLUMN "purchaserequest_id",
ADD COLUMN     "purchaserequest_id" INTEGER;
