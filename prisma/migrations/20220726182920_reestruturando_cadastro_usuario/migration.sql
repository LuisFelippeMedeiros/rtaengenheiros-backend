/*
  Warnings:

  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `complement` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_birth` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `rg` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_cpf_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "address",
DROP COLUMN "complement",
DROP COLUMN "cpf",
DROP COLUMN "date_of_birth",
DROP COLUMN "district",
DROP COLUMN "number",
DROP COLUMN "rg",
DROP COLUMN "telephone",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deteled_by" TEXT,
ADD COLUMN     "updated_by" TEXT;
