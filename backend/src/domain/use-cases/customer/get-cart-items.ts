import moment from 'moment';
import { GetCartItemsReqDto, GetCartItemsResDto } from '../../interfaces/dto/order';
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { OrderRepository } from "../../interfaces/repositories/order-repository";
import { ProductRepository } from '../../interfaces/repositories/product-repository';
import { GetCartItemsUseCase } from "../../interfaces/use-cases/customer/get-cart-items-use-case";
import * as util from '../../../utils/util';

export class GetCartItems implements GetCartItemsUseCase {
    orderRepository: OrderRepository
    productRepository: ProductRepository

    constructor(orderRepository: OrderRepository, productRepository: ProductRepository) {
        this.orderRepository = orderRepository
        this.productRepository = productRepository
    }

    async execute(params: GetCartItemsReqDto): Promise<GetCartItemsResDto | null> {
        let response: GetCartItemsResDto|null = null

        const cart = await this.orderRepository.getCartItems({ customer_id: params.customer_id, account_id: params.account_id })

        if (cart)
        {
            const cartItems = cart.cartProducts.map((cartItem: any) => {
                const productDto = {
                    qty: cartItem.item_qty,
                    product_id: cartItem.productSku,
                    product_name: decodeURI(cartItem.product.product.product_name),
                    product_image: cartItem.product.product.product_image,
                    product_price: util.convert_to_decimal_price(cartItem.item_price).toLocaleString('en-us', {minimumFractionDigits: 2}),
                    category: decodeURI(cartItem.product.product.category_name)
                }

                return productDto
            })

            response = {
                statusCode: 200,
                message: undefined,
                result: cartItems
            }
        }
        else
        {
            response = {
                statusCode: 400,
                message: "Cart does not exist.",
                result: []
            }
        }

        return response
    }

    validate(params: GetCartItemsReqDto): GeneralValidationDto {
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