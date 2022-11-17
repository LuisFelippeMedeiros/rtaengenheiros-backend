-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "purchaserequests" ADD COLUMN     "is_approved_diretor" BOOLEAN,
ADD COLUMN     "is_approved_gestor" BOOLEAN;
