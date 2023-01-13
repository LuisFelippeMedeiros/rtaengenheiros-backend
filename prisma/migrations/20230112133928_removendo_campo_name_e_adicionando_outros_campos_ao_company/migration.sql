/*
  Warnings:

  - You are about to drop the column `name` on the `companies` table. All the data in the column will be lost.
  - Added the required column `city_id` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ie` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "name",
ADD COLUMN     "city_id" INTEGER NOT NULL,
ADD COLUMN     "ie" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
