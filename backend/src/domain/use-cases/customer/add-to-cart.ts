import moment from 'moment';
import { AddToCartReqDto, AddtoCartResDto } from '../../interfaces/dto/order';
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { OrderRepository } from "../../interfaces/repositories/order-repository";
import { ProductRepository } from '../../interfaces/repositories/product-repository';
import { AddToCartUseCase } from '../../interfaces/use-cases/customer/add-to-cart-use-case';

export class AddToCart implements AddToCartUseCase {
    orderRepository: OrderRepository
    productRepository: ProductRepository

    constructor(orderRepository: OrderRepository, productRepository: ProductRepository) {
        this.orderRepository = orderRepository
        this.productRepository = productRepository
    }

    async execute(params: AddToCartReqDto): Promise<AddtoCartResDto | null> {
        let response: AddtoCartResDto|null = null

        const product = await this.productRepository.getCatalogProductDetail({ product_id: params.product_sku, filter_params: undefined })
        const cart = await this.orderRepository.getCartItems({ customer_id: params.customer_id, account_id: params.account_id })
        var currentItem = cart.cartProducts.find((p: { productSku: any; }) => p.productSku === product.productSku )

        if (currentItem)
        {
            params.cart_product_id = currentItem.cartProductId
            params.new_stock_amt = product.stock_amt - params.qty!
            params.product_price = product.sku_price
            params.qty += currentItem.item_qty
            console.log("item exists: ", params)
            const result = await this.orderRepository.addToCart(params)
            
            if (result)
            {
                response = {
                    statusCode: 200,
                    message: "Successfully add item to cart."
                }
            }
        }
        else if (product)
        {
            if (product.stock_amt < params.qty!)
            {
                response = {
                    statusCode: 400,
                    message: "The requested quantity exceed the stock amount of the product."
                }
            }
            else
            {
                params.cart_id = cart.cartId
                params.cart_product_id = -1
                params.new_stock_amt = product.stock_amt - params.qty!
                params.product_price = product.sku_price

                console.log("new product: ", params)
                const result = await this.orderRepository.addToCart(params)
        
                if (result)
                {
                    response = {
                        statusCode: 200,
                        message: "Successfully add item to cart."
                    }
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

    validate(params: AddToCartReqDto): GeneralValidationDto {
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