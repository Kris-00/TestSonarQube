import server from './server'
import { prisma } from './data/data-source/postgres'
import { AccountLogin } from './domain/use-cases/account/account-login'
import { CustomerRegistration } from './domain/use-cases/account/customer-registration'
import { CustomerGetAccountDetails } from './domain/use-cases/customer/get-account-details'
import { CustomerUpdateAccountDetails } from './domain/use-cases/customer/update-account-details'
import { AccountRepositoryImpl } from './domain/repositories/account-repository'
import AccountRouter from './routers/account-router'
import CatalogRouter from './routers/catalog-router'
import { GetCatalogProducts } from './domain/use-cases/customer/get-catalog-products'
import { ProductRepositoryImpl } from './domain/repositories/product-repository'
import { GetCatalogProductDetails } from './domain/use-cases/customer/get-catalog-product-detail'
import ProductRouter from './routers/product-router'
import { AddProduct } from './domain/use-cases/vendor/add-product'
import { UpdateProduct } from './domain/use-cases/vendor/update-product'
import { DeleteProduct } from './domain/use-cases/vendor/delete-product'
import { GetProducts } from './domain/use-cases/vendor/get-products'
import { GetProductDetails } from './domain/use-cases/vendor/get-product-details'
import CartRouter from './routers/cart-router'
import { AddToCart } from './domain/use-cases/customer/add-to-cart'
import { OrderRepositoryImpl } from './domain/repositories/order-repository'
import { UpdateCartItem } from './domain/use-cases/customer/update-cart-item'
import { RemoveFromCart } from './domain/use-cases/customer/remove-from-cart'
import { GetCartItems } from './domain/use-cases/customer/get-cart-items'
import { Checkout } from './domain/use-cases/customer/checkout'
import { v2 as cloudinary } from 'cloudinary'
import sgMail from '@sendgrid/mail'
import OrderRouter from './routers/order-router'
import { GetOrderHistory } from './domain/use-cases/customer/get-order-history'
import { GetOrderDetails } from './domain/use-cases/customer/get-order-details'
import AdminRouter from './routers/admin-router'
import { ResetPassword } from './domain/use-cases/account/reset-password'
import { CreateVendorAccount } from './domain/use-cases/admin/create-vendor-acc'

(async () => {
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY!)
    
    cloudinary.config({ 
      cloud_name: process.env.CLOUD_NAME, 
      api_key: process.env.CLOUDINARY_KEY, 
      api_secret: process.env.CLOUDINARY_SECRET,
      secure: true
    });

  
    const accountMiddleWare = AccountRouter(
        new AccountLogin(new AccountRepositoryImpl(prisma)),
        new CustomerRegistration(new AccountRepositoryImpl(prisma)),
        new CustomerGetAccountDetails(new AccountRepositoryImpl(prisma)),
        new CustomerUpdateAccountDetails(new AccountRepositoryImpl(prisma)),
        new ResetPassword(new AccountRepositoryImpl(prisma))
        )
    
    const catalogMiddleWare = CatalogRouter(
      new GetCatalogProducts(new ProductRepositoryImpl(prisma)),
      new GetCatalogProductDetails(new ProductRepositoryImpl(prisma))
    )

    const productMiddleWare = ProductRouter(
      new AddProduct(new ProductRepositoryImpl(prisma)),
      new UpdateProduct(new ProductRepositoryImpl(prisma)),
      new DeleteProduct(new ProductRepositoryImpl(prisma)),
      new GetProducts(new ProductRepositoryImpl(prisma)),
      new GetProductDetails(new ProductRepositoryImpl(prisma)),
    )

    const cartMiddleWare = CartRouter(
      new GetCartItems(new OrderRepositoryImpl(prisma), new ProductRepositoryImpl(prisma)),
      new AddToCart(new OrderRepositoryImpl(prisma), new ProductRepositoryImpl(prisma)),
      new UpdateCartItem(new OrderRepositoryImpl(prisma), new ProductRepositoryImpl(prisma)),
      new RemoveFromCart(new OrderRepositoryImpl(prisma), new ProductRepositoryImpl(prisma)),
      new Checkout(new OrderRepositoryImpl(prisma), new ProductRepositoryImpl(prisma))
    )

    const orderMiddleWare = OrderRouter(
      new GetOrderHistory(new OrderRepositoryImpl(prisma), new ProductRepositoryImpl(prisma)),
      new GetOrderDetails(new OrderRepositoryImpl(prisma), new ProductRepositoryImpl(prisma)),
    )
    
    const adminMiddleWare = AdminRouter(
      new CreateVendorAccount(new AccountRepositoryImpl(prisma))
    )
    const port = 4001

    server.use("/admin", adminMiddleWare)
    server.use("/account", accountMiddleWare)
    server.use("/catalog", catalogMiddleWare)
    server.use("/product", productMiddleWare)
    server.use("/cart", cartMiddleWare)
    server.use("/order", orderMiddleWare)

    server.listen(port, "0.0.0.0", () => console.log(`Running on http://localhost:${port}`))
})().then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })