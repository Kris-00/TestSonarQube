import moment from 'moment';
import { GetVendorProductListReqDto, GetVendorProductListResDto } from '../../interfaces/dto/product';
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { ProductRepository } from "../../interfaces/repositories/product-repository";
import { GetProductsUseCase } from '../../interfaces/use-cases/vendor/get-products-use-case';
import * as util from '../../../utils/util';

export class GetProducts implements GetProductsUseCase {
    productRepository: ProductRepository
    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository
    }

    async execute(params: GetVendorProductListReqDto): Promise<GetVendorProductListResDto | null> {
        let response: GetVendorProductListResDto|null = null

        const result = await this.productRepository.getProductList(params)

        if (result)
        {
            const items = result.map((product: any) => { 
                const productDto = {
                    product_id: product.productStock[0].productSku, 
                    category: decodeURI(product.category_name),
                    product_name: decodeURI(product.product_name), 
                    product_price: util.convert_to_decimal_price(product.productStock[0].sku_price).toLocaleString('en-us', {minimumFractionDigits: 2}), 
                    product_image: product.product_image,
                    product_stock: product.productStock[0].stock_amt
                }

                return productDto
            })

            response = {
                statusCode: 200,
                message:undefined,
                result: items
            }
        }
        else
        {
            response = {
                statusCode: 200,
                message: undefined,
                result: []
            }
        }

        return response
    }
    
    validate(params: GetVendorProductListReqDto): GeneralValidationDto {
        var isValid = true;
        var errorMsg = "";

        if (params)
        {
            if (!params.vendor_id)
            {
                isValid &&= false
                errorMsg += "Invalid Request.\n"
            }
        }
        else
        {
            isValid &&= false
            errorMsg += "Invalid request."
        }

        return { isValid: isValid, message: errorMsg }
    }
}