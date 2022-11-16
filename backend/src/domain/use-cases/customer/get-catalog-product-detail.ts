import moment from 'moment'
import * as util from '../../../utils/util'
import { ProductRepository } from '../../interfaces/repositories/product-repository'
import { GetProductDetailReqDto, ProductDto } from '../../interfaces/dto/product';
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { CustomerGetCatalogProductDetailUseCase } from '../../interfaces/use-cases/customer/get-catalog-product-details-use-case';

export class GetCatalogProductDetails implements CustomerGetCatalogProductDetailUseCase {
    productRepository: ProductRepository
    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository
    }

    async execute(params: GetProductDetailReqDto): Promise<ProductDto | null> {
        let response: ProductDto|null = null

        const result:any = await this.productRepository.getCatalogProductDetail(params)
        
        if (result)
        {
            response = {
                statusCode: 200,
                message: undefined,
                product_id: result.product_sku,
                category: decodeURI(result.product.category_name),
                product_name: decodeURI(result.product.product_name),
                product_image: result.product.product_image,
                product_price: util.convert_to_decimal_price(result.sku_price).toLocaleString('en-us', {minimumFractionDigits: 2})
            }
        }
        else 
        {
            response = {
                statusCode: 404,
                message: "Product does not exist",
                category: undefined,
                product_id: undefined,
                product_name: undefined,
                product_image: undefined,
                product_price: undefined
            }
        }

        return response
    }
    
    validate(params: GetProductDetailReqDto): GeneralValidationDto {
        const valid_filters = ['keyword']
        var isValid = true;
        var errorMsg = "";

        if (params)
        {
            if (!params.product_id)
            {
                isValid &&= false;
                errorMsg += "Please do not leave 'product_id' field blank.\n"
            }
        }
        else
        {
            isValid &&= false;
            errorMsg = "Invalid Product ID"
        }

        return { isValid: isValid, message: errorMsg }
    }
}