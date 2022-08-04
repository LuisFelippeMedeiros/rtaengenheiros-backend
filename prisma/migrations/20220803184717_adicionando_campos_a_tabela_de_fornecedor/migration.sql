/*
  Warnings:

  - Added the required column `bank` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bank" TEXT NOT NULL,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "pix" TEXT;
