/*
  Warnings:

  - Added the required column `type` to the `billstopay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "billstopay" ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "payment_info" DROP NOT NULL,
ALTER COLUMN "authorized" DROP NOT NULL,
ALTER COLUMN "invoice" DROP NOT NULL,
ALTER COLUMN "due_date" DROP NOT NULL,
ALTER COLUMN "scheduling" DROP NOT NULL,
ALTER COLUMN "dda" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "reference_month" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "type" TEXT;
