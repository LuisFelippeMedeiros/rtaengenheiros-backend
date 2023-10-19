-- AlterTable
ALTER TABLE "products" ADD COLUMN     "purchaseorderproduct_id" TEXT;

-- CreateTable
CREATE TABLE "purchaseorders" (
    "id" TEXT NOT NULL,
    "supplier_id" TEXT,
    "shipping_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "purchaseorderproduct_id" TEXT NOT NULL,

    CONSTRAINT "purchaseorders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchaseorderproducts" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "purchaseorderproducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PurchaseOrderToPurchaseRequest" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PurchaseOrderToPurchaseRequest_AB_unique" ON "_PurchaseOrderToPurchaseRequest"("A", "B");

-- CreateIndex
CREATE INDEX "_PurchaseOrderToPurchaseRequest_B_index" ON "_PurchaseOrderToPurchaseRequest"("B");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_purchaseorderproduct_id_fkey" FOREIGN KEY ("purchaseorderproduct_id") REFERENCES "purchaseorderproducts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchaseorders" ADD CONSTRAINT "purchaseorders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchaseorders" ADD CONSTRAINT "purchaseorders_purchaseorderproduct_id_fkey" FOREIGN KEY ("purchaseorderproduct_id") REFERENCES "purchaseorderproducts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PurchaseOrderToPurchaseRequest" ADD CONSTRAINT "_PurchaseOrderToPurchaseRequest_A_fkey" FOREIGN KEY ("A") REFERENCES "purchaseorders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PurchaseOrderToPurchaseRequest" ADD CONSTRAINT "_PurchaseOrderToPurchaseRequest_B_fkey" FOREIGN KEY ("B") REFERENCES "purchaserequests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
