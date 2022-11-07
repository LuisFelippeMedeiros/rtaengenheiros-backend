/*
  Warnings:

  - You are about to drop the column `deteled_by` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "deteled_by",
ADD COLUMN     "deleted_by" TEXT;
