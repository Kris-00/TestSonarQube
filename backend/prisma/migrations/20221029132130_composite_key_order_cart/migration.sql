/*
  Warnings:

  - A unique constraint covering the columns `[cartId]` on the table `Cart_Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productSku]` on the table `Cart_Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `Order_Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productSku]` on the table `Order_Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cart_Product_cartId_key" ON "Cart_Product"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_Product_productSku_key" ON "Cart_Product"("productSku");

-- CreateIndex
CREATE UNIQUE INDEX "Order_Product_orderId_key" ON "Order_Product"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_Product_productSku_key" ON "Order_Product"("productSku");
