/*
  Warnings:

  - You are about to drop the column `ie` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `pix2` on the `suppliers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "ie",
DROP COLUMN "pix2",
ADD COLUMN     "account_type" TEXT,
ADD COLUMN     "operation" TEXT;
