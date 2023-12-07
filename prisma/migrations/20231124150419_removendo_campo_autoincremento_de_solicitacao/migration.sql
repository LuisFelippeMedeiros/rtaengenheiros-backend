-- AlterTable
ALTER TABLE "purchaserequests" ALTER COLUMN "identifier" DROP DEFAULT;
DROP SEQUENCE "purchaserequests_identifier_seq";
