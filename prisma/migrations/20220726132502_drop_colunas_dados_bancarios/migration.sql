/*
  Warnings:

  - You are about to drop the column `account` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `agency` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `bank` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `pix` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_pix_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "account",
DROP COLUMN "agency",
DROP COLUMN "bank",
DROP COLUMN "pix";
