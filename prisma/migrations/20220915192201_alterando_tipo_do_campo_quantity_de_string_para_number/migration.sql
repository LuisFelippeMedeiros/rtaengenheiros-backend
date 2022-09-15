/*
  Warnings:

  - The `quantity` column on the `purchaserequestbudgets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "purchaserequestbudgets" DROP COLUMN "quantity",
ADD COLUMN     "quantity" INTEGER;
