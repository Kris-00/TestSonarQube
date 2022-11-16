import moment from 'moment';
import { RemoveFromCartReqDto, RemoveFromCartResDto } from '../../interfaces/dto/order';
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { OrderRepository } from "../../interfaces/repositories/order-repository";
import { ProductRepository } from '../../interfaces/repositories/product-repository';
import { RemoveFromCartUseCase } from '../../interfaces/use-cases/customer/remove-from-cart-use-case';

export class RemoveFromCart implements RemoveFromCartUseCase {
    orderRepository: OrderRepository
    productRepository: ProductRepository

    constructor(orderRepository: OrderRepository, productRepository: ProductRepository) {
        this.orderRepository = orderRepository
        this.productRepository = productRepository
    }

    async execute(params: RemoveFromCartReqDto): Promise<RemoveFromCartResDto | null> {
        let response: RemoveFromCartResDto|null = null

        const product = await this.productRepository.getCatalogProductDetail({ product_id: params.product_sku, filter_params: undefined })
        const cart = await this.orderRepository.getCartItems({ customer_id: params.customer_id, account_id: params.account_id })
        var currentItem = cart.cartProducts.find((p: { productSku: any; }) => p.productSku === product.productSku )
       
        if (!currentItem)
        {
            response = {
                statusCode: 400,
                message: "The item you are trying to remove does not exist in your cart."
            }
        }
        else if (product)
        {
            params.new_stock_amt = product.stock_amt + currentItem.item_qty
            params.product_price = product.sku_price
            const result = await this.orderRepository.removeFromCart(params)

            if (result)
            {
                response = {
                    statusCode: 200,
                    message: "Successfully removed item in cart."
                }
            }
        } 
        else
        {
            response = {
                statusCode: 400,
                message: "Product does not exist"
            }
        }

        return response
    }

    validate(params: RemoveFromCartReqDto): GeneralValidationDto {
        var isValid = true
        var errorMsg = ""

        if (params)
        {
            if (!params.product_sku)
            {
                isValid &&= false
                errorMsg += "Please do not leave the product id field blank.\n"
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