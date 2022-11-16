import moment from 'moment';
import { GetOrderReqDto, GetOrderResDto } from '../../interfaces/dto/order'
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { OrderRepository } from "../../interfaces/repositories/order-repository";
import { ProductRepository } from '../../interfaces/repositories/product-repository';
import { CustomerGetOrderDetailsUseCase } from '../../interfaces/use-cases/customer/get-order-details-use-case';
import * as util from '../../../utils/util'

export class GetOrderDetails implements CustomerGetOrderDetailsUseCase {
    orderRepository: OrderRepository
    productRepository: ProductRepository

    constructor(orderRepository: OrderRepository, productRepository: ProductRepository) {
        this.orderRepository = orderRepository
        this.productRepository = productRepository
    }

    async execute(params: GetOrderReqDto): Promise<GetOrderResDto | null> {
        let response: GetOrderResDto|null = null
        
        const result = await this.orderRepository.getOrderDetails(params)

        if (result)
        {
            const items = result.orderItems.map((item: any) => {
                const orderItem = {
                    product_id: item.productSku,
                    product_name: decodeURI(item.product.product.product_name),
                    product_price: util.convert_to_decimal_price(item.item_price).toLocaleString('en-us', {minimumFractionDigits: 2}),
                    product_image: item.product.product.product_image,
                    qty: item.item_qty,
                    category: decodeURI(item.product.product.category_name),
                }

                return orderItem
            })

            response = {
                statusCode: 200,
                message: undefined,
                order_items: items,
                order_total: util.convert_to_decimal_price(result.order_total).toLocaleString('en-us', {minimumFractionDigits: 2}),
                payment_date: result.paymentDate
            }
        }
        else
        {
            response = {
                statusCode: 400,
                message: "Order does not exist",
                order_items: undefined,
                order_total: undefined,
                payment_date: undefined
            }
        }

        return response
    }

    validate(params: GetOrderReqDto): GeneralValidationDto {
        var isValid = true
        var errorMsg = ""

        if (params)
        {
        }
        else
        {
            isValid &&= false
            errorMsg += "Invalid request.\n"
        }

        return { isValid: isValid, message: errorMsg}
    }
}