/*
  Warnings:

  - You are about to drop the column `unit` on the `purchaserequestbudgets` table. All the data in the column will be lost.
  - Added the required column `unit_id` to the `purchaserequestbudgets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "purchaserequestbudgets" DROP COLUMN "unit",
ADD COLUMN     "unit_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "purchaserequestbudgets" ADD CONSTRAINT "purchaserequestbudgets_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
