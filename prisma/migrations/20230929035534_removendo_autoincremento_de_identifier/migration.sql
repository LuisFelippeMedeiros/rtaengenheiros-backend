-- AlterTable
ALTER TABLE "purchaseorders" ALTER COLUMN "identifier" DROP DEFAULT;
DROP SEQUENCE "purchaseorders_identifier_seq";
