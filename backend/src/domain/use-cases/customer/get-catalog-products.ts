import moment from 'moment'
import * as util from '../../../utils/util'
import { ProductRepository } from '../../interfaces/repositories/product-repository'
import { GetCatalogReqDto, ProductListDto } from '../../interfaces/dto/product';
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { CustomerGetCatalogProductsUseCase } from '../../interfaces/use-cases/customer/get-catalog-products-use-case';

export class GetCatalogProducts implements CustomerGetCatalogProductsUseCase {
    productRepository: ProductRepository
    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository
    }

    async execute(params: GetCatalogReqDto): Promise<ProductListDto | null> {
        let response: ProductListDto|null = null

        const result = await this.productRepository.getCatalogProducts(params)

        if (result)
        {
            const items = result.map((product: any) => { 
                const productDto = {
                    product_id: product.productSku, 
                    category: decodeURI(product.product.category_name),
                    product_name: decodeURI(product.product.product_name), 
                    product_price: util.convert_to_decimal_price(product.sku_price).toLocaleString('en-us', {minimumFractionDigits: 2}), 
                    product_image: product.product.product_image
                }

                return productDto
            })

            const total_page_count = Math.ceil(items.length/params.display_count!)

            response = {
                statusCode: 200,
                message: undefined,
                total_pages: total_page_count,
                result: items
            }
        }
        else
        {
            response = {
                statusCode: 200,
                message: undefined,
                total_pages: undefined,
                result: []
            }
        }

        return response
    }

    validate(params: GetCatalogReqDto): GeneralValidationDto {
        var isValid = true;
        var errorMsg = "";

        if (params) 
        {
            if (params.filter_params)
            {}
        }
        else
        {
            isValid &&= false
            errorMsg += "Invalid Request.\n"
        }

        return { isValid: isValid, message: errorMsg }
    }
}