/*
  Warnings:

  - Added the required column `reference_month` to the `billstopay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "billstopay" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "issue_date" TIMESTAMP(3),
ADD COLUMN     "reference_month" TEXT NOT NULL,
ALTER COLUMN "invoice_attachment" DROP NOT NULL;
