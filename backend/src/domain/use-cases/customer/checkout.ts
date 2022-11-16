import moment from 'moment';
import { AddToCartReqDto, AddtoCartResDto, CheckoutReqDto, CheckoutResDto } from '../../interfaces/dto/order';
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { OrderRepository } from "../../interfaces/repositories/order-repository";
import { ProductRepository } from '../../interfaces/repositories/product-repository';
import { CheckoutUseCase } from '../../interfaces/use-cases/customer/checkout-use-case';

export class Checkout implements CheckoutUseCase {
    orderRepository: OrderRepository
    productRepository: ProductRepository

    constructor(orderRepository: OrderRepository, productRepository: ProductRepository) {
        this.orderRepository = orderRepository
        this.productRepository = productRepository
    }

    async execute(params: CheckoutReqDto): Promise<CheckoutResDto | null> {
        let response: CheckoutResDto|null = null

        const cart = await this.orderRepository.getCartItems({ customer_id: params.customer_id, account_id: params.account_id })

        if (!cart.cartProducts || cart.cartProducts.length <= 0)
        {
            response = {
                statusCode: 400,
                message: "Unable to checkout an empty cart."
            }
        }
        else if (cart)
        {
            var order_total_amt:number = 0
            const order_items = cart.cartProducts.map((cartItem: any) => {
                const orderItem = {
                    productSku: cartItem.productSku,
                    vendorId: cartItem.product.product.vendorId,
                    item_qty: cartItem.item_qty,
                    item_price: cartItem.item_price
                }
                
                order_total_amt += (cartItem.item_qty*cartItem.item_price)
                return orderItem
            })

            const addOrderReq = {
                cart_id: cart.cartId,
                customer_id: params.customer_id,
                order_total: order_total_amt,
                order_items: order_items
            }

            const result = await this.orderRepository.addOrder(addOrderReq)

            if (result)
            {
                response = {
                    statusCode: 200,
                    message: `Successfully checkout, your Order ID is ${result.orderId}`
                }
            }
            else
            {
                response = {
                    statusCode: 400,
                    message: "Unable to checkout, please try again."
                }
            }
        }
        else
        {
            response = {
                statusCode: 400,
                message: "Invalid request"
            }
        }
        return response
    }

    validate(params: CheckoutReqDto): GeneralValidationDto {
        var isValid = true
        var errorMsg = ""

        if (params)
        {
            if (!params.customer_id)
            {
                isValid &&= false
                errorMsg += "Invalid request.\n"
            }

            if (!params.account_id)
            {
                isValid &&= false
                errorMsg += "Invalid request.\n"
            }
        }
        else
        {
            isValid &&= false
            errorMsg += "Invalid request.\n"
        }

        return { isValid: isValid, message: errorMsg}
    }
}