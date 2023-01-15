/*
  Warnings:

  - You are about to drop the column `company_id` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `roles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_company_id_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_company_id_fkey";

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "company_id";

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "company_id";
