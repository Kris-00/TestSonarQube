-- CreateTable
CREATE TABLE "Admin" (
    "adminId" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "vendorId" SERIAL NOT NULL,
    "store_name" TEXT NOT NULL,
    "address_postal" INTEGER NOT NULL,
    "address_street" TEXT NOT NULL,
    "address_city" TEXT NOT NULL,
    "address_country" TEXT NOT NULL,
    "store_contact_no" INTEGER NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("vendorId")
);

-- CreateTable
CREATE TABLE "Customer" (
    "customerId" SERIAL NOT NULL,
    "accountId" TEXT NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customerId")
);

-- CreateTable
CREATE TABLE "Account" (
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "role" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" CHAR(60) NOT NULL,
    "is_loggedin" BOOLEAN NOT NULL,
    "last_loggedin" TIMESTAMP(3),
    "last_loggedin_ip" VARCHAR(15) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderId" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "order_total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentDate" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "Order_Product" (
    "cartProductId" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productSku" VARCHAR(255) NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "item_qty" INTEGER NOT NULL,
    "item_price" INTEGER NOT NULL,
    "review" VARCHAR(512),

    CONSTRAINT "Order_Product_pkey" PRIMARY KEY ("cartProductId")
);

-- CreateTable
CREATE TABLE "Cart" (
    "cartId" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("cartId")
);

-- CreateTable
CREATE TABLE "Cart_Product" (
    "cartProductId" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "productSku" VARCHAR(255) NOT NULL,
    "item_qty" INTEGER NOT NULL,
    "item_price" INTEGER NOT NULL,

    CONSTRAINT "Cart_Product_pkey" PRIMARY KEY ("cartProductId")
);

-- CreateTable
CREATE TABLE "Product_Stock" (
    "productSku" VARCHAR(255) NOT NULL,
    "productId" INTEGER NOT NULL,
    "sku_price" INTEGER NOT NULL,
    "stock_amt" INTEGER NOT NULL,
    "variant" VARCHAR(255),

    CONSTRAINT "Product_Stock_pkey" PRIMARY KEY ("productSku")
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "category_name" VARCHAR(255) NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_image" VARCHAR(512) NOT NULL,
    "product_price" INTEGER NOT NULL,
    "variant_name" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Access_Tokens" (
    "refreshId" TEXT NOT NULL,
    "refreshToken" VARCHAR(512) NOT NULL,
    "accessToken" VARCHAR(512) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Access_Tokens_pkey" PRIMARY KEY ("refreshId")
);

-- CreateTable
CREATE TABLE "Reset_Password_Tokens" (
    "reset_pw_id" SERIAL NOT NULL,
    "reset_token" TEXT NOT NULL,

    CONSTRAINT "Reset_Password_Tokens_pkey" PRIMARY KEY ("reset_pw_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_accountId_key" ON "Admin"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_accountId_key" ON "Vendor"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_accountId_key" ON "Customer"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_vendorId_key" ON "Product"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "Access_Tokens_accessToken_key" ON "Access_Tokens"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Reset_Password_Tokens_reset_token_key" ON "Reset_Password_Tokens"("reset_token");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Product" ADD CONSTRAINT "Order_Product_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Product" ADD CONSTRAINT "Order_Product_productSku_fkey" FOREIGN KEY ("productSku") REFERENCES "Product_Stock"("productSku") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Product" ADD CONSTRAINT "Order_Product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("vendorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_Product" ADD CONSTRAINT "Cart_Product_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("cartId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_Product" ADD CONSTRAINT "Cart_Product_productSku_fkey" FOREIGN KEY ("productSku") REFERENCES "Product_Stock"("productSku") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_Stock" ADD CONSTRAINT "Product_Stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
