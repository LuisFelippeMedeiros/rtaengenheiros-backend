-- CreateTable
CREATE TABLE "purchaserequestproducts" (
    "id" TEXT NOT NULL,
    "product_id" TEXT,
    "purchaserequest_id" TEXT,

    CONSTRAINT "purchaserequestproducts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "purchaserequestproducts" ADD CONSTRAINT "purchaserequestproducts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchaserequestproducts" ADD CONSTRAINT "purchaserequestproducts_purchaserequest_id_fkey" FOREIGN KEY ("purchaserequest_id") REFERENCES "purchaserequests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
