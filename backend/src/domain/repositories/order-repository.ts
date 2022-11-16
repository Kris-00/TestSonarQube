import { PrismaClient, Prisma } from '@prisma/client'
import moment from 'moment'
import * as DTO from '../interfaces/dto/order'
import { OrderRepository } from '../interfaces/repositories/order-repository'

export class OrderRepositoryImpl implements OrderRepository {
    _db: PrismaClient
    constructor(prisma: PrismaClient){
        this._db = prisma
    }

    async getCartItems(params: DTO.GetCartItemsReqDto): Promise<any|null> {
        const result = await this._db.cart.findFirst({
            where: { customerId: params.customer_id },
            include: { 
                cartProducts: { select: {
                    cartProductId:true,
                    productSku: true,
                    item_price: true,
                    item_qty: true,
                    product: {
                        select: {
                            product: true
                        }
                    }
            }} }
        })

        return result
    }

    async getOrders(params: DTO.GetOrderHistoryReqDto): Promise<any | null> {
        const result = await this._db.order.findMany({
            where: { customerId: params.customer_id  },
            include: { orderItems: {
                select: {
                    orderId: true,
                    product: {
                        select: {
                            product: true
                        }
                    },
                    productSku: true,
                    item_price: true,
                    item_qty: true,
                    review: true
                }
            } }
        })

        return result
    }

    async getOrderDetails(params: DTO.GetOrderReqDto): Promise< any | null> {
        const result = await this._db.order.findFirst({
            where: { orderId: params.order_id, customerId: params.customer_id },
            include: { orderItems: {
                select: {
                    orderId: true,
                    product: {
                        select: {
                            product: true
                        }
                    },
                    productSku: true,
                    item_price: true,
                    item_qty: true,
                    review: true
                }
            } }
        })

        return result
    }

    async getStoreOrders(params: DTO.GetStoreOrdersReqDto): Promise<any| null> {
        const result = await this._db.order_Product.findMany({
            where: { vendorId: params.vendor_id },
            include: { product: true}
        })

        return result
    }

    async getStoreOrderDetails(params: DTO.GetStoreOrderDetailsReqDto): Promise<any | null> {
        const result = await this._db.order_Product.findFirst({
            where: { orderId: params.order_id!, vendorId: params.vendor_id },
            include: { product: true }
        })

        return result
    }

    async addToCart(params: DTO.AddToCartReqDto): Promise<any | null> {
        const cart = await this._db.cart.findFirst({
            where: { customerId: params.customer_id },
            include: { cartProducts: true }
        })
        console.log("db: ", params, cart)

        const result = await this._db.cart_Product.upsert({
            where: { cartProductId: params.cart_product_id },
            create: {
                cartId: cart?.cartId!,
                productSku: params.product_sku!,
                item_qty: params.qty!,
                item_price: params.product_price!
            },
            update: {
                item_qty: params.qty!,
                item_price: params.product_price!
            }
        })

        if (result)
        {
            const stock = await this._db.product_Stock.updateMany({
                where: { productSku: params.product_sku },
                data: {
                    stock_amt: params.new_stock_amt
                }
            })
        }

        return result
    }

    async removeFromCart(params: DTO.RemoveFromCartReqDto): Promise<any | null> {
        const cart = await this._db.cart.findFirst({
            where: { customerId: params.customer_id },
            include: { cartProducts: true }
        })

        const result = await this._db.cart_Product.deleteMany({
            where: {
                cartId: cart?.cartId,
                productSku: params.product_sku
            }
        })

        const stock = await this._db.product_Stock.updateMany({
            where: { productSku: params.product_sku },
            data: {
                stock_amt: params.new_stock_amt
            }
        })
        
        return result
    }

    async leaveReview(params: DTO.LeaveReviewReqDto): Promise<any | null> {
        return null
    }

    async addOrder(params: DTO.AddOrderReqDto): Promise<any | null> {
        const result = await this._db.order.create({
            data: {
                customerId: params.customer_id!,
                order_total: params.order_total!,
                paymentDate: moment().toISOString(),
                orderItems: {
                    createMany: {
                        data: params.order_items
                    }
                }
            }
        })

        if (result)
        {
            const result2 = await this._db.cart_Product.deleteMany({
                where: { cartId: params.cart_id}
            })
        }
        
        return result
    }

    async updateOrder(params: DTO.UpdateOrderReqDto): Promise<any | null> {
        throw new Error('Method not implemented.')
    }

    async deleteOrder(params: DTO.DeleteOrderReqDto): Promise<any | null> {
        throw new Error('Method not implemented.')
    }
}