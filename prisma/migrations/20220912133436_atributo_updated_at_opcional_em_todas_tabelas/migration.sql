-- AlterTable
ALTER TABLE "billstopay" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "companies" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "purchaserequests" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "status" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "suppliers" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL;
