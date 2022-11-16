import moment from 'moment';
import { UpdateCartItemReqDto, UpdateCartItemResDto } from '../../interfaces/dto/order';
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { OrderRepository } from "../../interfaces/repositories/order-repository";
import { ProductRepository } from '../../interfaces/repositories/product-repository';
import { UpdateCartItemUseCase } from '../../interfaces/use-cases/customer/update-cart-item-use-case';

export class UpdateCartItem implements UpdateCartItemUseCase {
    orderRepository: OrderRepository
    productRepository: ProductRepository

    constructor(orderRepository: OrderRepository, productRepository: ProductRepository) {
        this.orderRepository = orderRepository
        this.productRepository = productRepository
    }

    async execute(params: UpdateCartItemReqDto): Promise<UpdateCartItemResDto | null> {
        let response: UpdateCartItemResDto|null = null

        const product = await this.productRepository.getCatalogProductDetail({ product_id: params.product_sku, filter_params: undefined })
        const cart = await this.orderRepository.getCartItems({ customer_id: params.customer_id, account_id: params.account_id })
        var currentItem = cart.cartProducts.find((p: { productSku: any; }) => p.productSku === product.productSku )
       
        if (!currentItem)
        {
            response = {
                statusCode: 400,
                message: "The item you are trying to update does not exist in your cart."
            }
        }
        else if (product)
        {
            if (params.qty! === 0) // Remove Cart From Item if Requested Qty = 0
            {
                params.cart_product_id = currentItem.cartProductId!
                params.new_stock_amt = product.stock_amt + currentItem.item_qty - params.qty!
                params.product_price = product.sku_price
                const result = await this.orderRepository.removeFromCart(params)

                if (result)
                {
                    response = {
                        statusCode: 200,
                        message: "Successfully removed item from the cart."
                    }
                }
            }
            else if ((product.stock_amt + currentItem.item_qty - params.qty!) >= 0)
            {
                params.cart_product_id = currentItem.cartProductId!
                params.new_stock_amt = product.stock_amt + currentItem.item_qty - params.qty!
                params.product_price = product.sku_price
                const result = await this.orderRepository.addToCart(params)
        
                if (result)
                {
                    response = {
                        statusCode: 200,
                        message: "Successfully updated item in cart."
                    }
                }
            }
            else
            {
                response = {
                    statusCode: 400,
                    message: "The requested quantity is not available."
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

    validate(params: UpdateCartItemReqDto): GeneralValidationDto {
        var isValid = true
        var errorMsg = ""

        if (params)
        {
            if (!params.product_sku)
            {
                isValid &&= false
                errorMsg += "Please do not leave the product id field blank.\n"
            }

            if (!params.qty)
            {
                isValid &&= false
                errorMsg += "Please do not leave the qty field blank.\n"
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