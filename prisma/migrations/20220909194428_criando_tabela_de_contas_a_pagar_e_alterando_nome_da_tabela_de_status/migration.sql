/*
  Warnings:

  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `budget` on the `purchaserequestbudgets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "purchaserequests" DROP CONSTRAINT "purchaserequests_status_id_fkey";

-- AlterTable
ALTER TABLE "purchaserequestbudgets" DROP COLUMN "budget",
ADD COLUMN     "budget" DECIMAL(65,30) NOT NULL;

-- DropTable
DROP TABLE "Status";

-- CreateTable
CREATE TABLE "status" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billstopay" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "payment_info" TEXT NOT NULL,
    "authorized" TEXT NOT NULL,
    "invoice" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "scheduling" TIMESTAMP(3) NOT NULL,
    "supplier_id" TEXT,
    "dda" BOOLEAN NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "invoice_attachment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "billstopay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "status_name_key" ON "status"("name");

-- AddForeignKey
ALTER TABLE "purchaserequests" ADD CONSTRAINT "purchaserequests_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billstopay" ADD CONSTRAINT "billstopay_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
