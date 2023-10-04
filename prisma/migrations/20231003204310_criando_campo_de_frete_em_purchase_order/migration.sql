/*
  Warnings:

  - Added the required column `shipping_fee` to the `purchaseorderproducts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "purchaseorderproducts" ADD COLUMN     "shipping_fee" DOUBLE PRECISION NOT NULL;

-- AlterTable
CREATE SEQUENCE purchaseorders_identifier_seq;
ALTER TABLE "purchaseorders" ALTER COLUMN "identifier" SET DEFAULT nextval('purchaseorders_identifier_seq');
ALTER SEQUENCE purchaseorders_identifier_seq OWNED BY "purchaseorders"."identifier";
