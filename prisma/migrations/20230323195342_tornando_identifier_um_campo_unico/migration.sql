/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `purchaserequests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "purchaserequests_identifier_key" ON "purchaserequests"("identifier");
