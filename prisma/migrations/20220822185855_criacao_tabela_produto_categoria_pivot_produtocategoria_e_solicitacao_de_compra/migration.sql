-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoriesproduct" (
    "id" TEXT NOT NULL,
    "product_id" TEXT,
    "category_id" TEXT,

    CONSTRAINT "categoriesproduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchaserequests" (
    "id" TEXT NOT NULL,
    "quantity" TEXT,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "rejected_at" TIMESTAMP(3),
    "rejected_by" TEXT,
    "category_id" TEXT,
    "product_id" TEXT,

    CONSTRAINT "purchaserequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchaserequestbudgets" (
    "id" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "supplier_id" TEXT,
    "purchaserequest_id" TEXT,

    CONSTRAINT "purchaserequestbudgets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "categoriesproduct" ADD CONSTRAINT "categoriesproduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoriesproduct" ADD CONSTRAINT "categoriesproduct_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchaserequests" ADD CONSTRAINT "purchaserequests_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchaserequests" ADD CONSTRAINT "purchaserequests_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchaserequestbudgets" ADD CONSTRAINT "purchaserequestbudgets_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchaserequestbudgets" ADD CONSTRAINT "purchaserequestbudgets_purchaserequest_id_fkey" FOREIGN KEY ("purchaserequest_id") REFERENCES "purchaserequests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
