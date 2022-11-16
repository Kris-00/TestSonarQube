import moment from 'moment';
import { GetOrderHistoryReqDto, GetOrderHistoryResDto } from '../../interfaces/dto/order'
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { OrderRepository } from "../../interfaces/repositories/order-repository";
import { ProductRepository } from '../../interfaces/repositories/product-repository';
import { CustomerGetOrderHistoryUseCase } from '../../interfaces/use-cases/customer/get-order-history-use-case';
import * as util from '../../../utils/util';

export class GetOrderHistory implements CustomerGetOrderHistoryUseCase {
    orderRepository: OrderRepository
    productRepository: ProductRepository

    constructor(orderRepository: OrderRepository, productRepository: ProductRepository) {
        this.orderRepository = orderRepository
        this.productRepository = productRepository
    }

    async execute(params: GetOrderHistoryReqDto): Promise<GetOrderHistoryResDto | null> {
        let response: GetOrderHistoryResDto|null = null

        const result = await this.orderRepository.getOrders(params)

        if (result)
        {
            const items = result.map((order: any) => {
                const orderItemArr = order.orderItems.map((item: any) => {
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

                const orderDetail = {
                    order_id: order.orderId,
                    order_total: util.convert_to_decimal_price(order.order_total).toLocaleString('en-us', {minimumFractionDigits: 2}),
                    payment_date: order.paymentDate,
                    order_items: orderItemArr
                }

                return orderDetail
            })

            response = {
                statusCode: 200,
                message: undefined,
                result: items
            }
        }
        else 
        { 
            response = {
                statusCode: 400,
                message: "Unable to retrieve the order history.",
                result: undefined
            }
        }

        return response
    }

    validate(params: GetOrderHistoryReqDto): GeneralValidationDto {
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