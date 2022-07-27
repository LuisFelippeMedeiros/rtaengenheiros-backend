/*
  Warnings:

  - You are about to drop the column `city_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `state_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_city_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_state_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "city_id",
DROP COLUMN "state_id";
