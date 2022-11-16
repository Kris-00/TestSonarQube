import moment from 'moment';
import { GetVendorProductDetailsReqDto, GetVendorProductDetailsResDto } from '../../interfaces/dto/product';
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { ProductRepository } from "../../interfaces/repositories/product-repository";
import { GetProductDetailsUseCase } from '../../interfaces/use-cases/vendor/get-product-details-use-case';
import * as util from '../../../utils/util';

export class GetProductDetails implements GetProductDetailsUseCase {
    productRepository: ProductRepository
    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository
    }

    async execute(params: GetVendorProductDetailsReqDto): Promise<GetVendorProductDetailsResDto | null> {
        let response: GetVendorProductDetailsResDto|null = null

        const result = await this.productRepository.getProduct(params)
        
        if (result)
        {
            response = {
                statusCode: 200,
                message: undefined,
                product_id: result.productSku,
                product_name: decodeURI(result.product.product_name),
                product_price: util.convert_to_decimal_price(result.sku_price).toLocaleString('en-us', {minimumFractionDigits: 2}),
                product_image: result.product.product_image,
                product_stock: result.stock_amt,
                category: decodeURI(result.product.category_name),
                updated_at: moment(result.updatedAt).valueOf()
            }
        }
        else
        {
            response = {
                statusCode: 400,
                message: `Unable to retrieve the product with ID '${params.product_sku}'`,
                product_id: undefined,
                product_name: undefined,
                product_price: undefined,
                product_image: undefined,
                product_stock: undefined,
                category: undefined,
                updated_at: undefined
            }
        }

        return response
    }
    
    validate(params: GetVendorProductDetailsReqDto): GeneralValidationDto {
        var isValid = true;
        var errorMsg = "";

        if (params)
        {
            if (!params.vendor_id)
            {
                isValid &&= false
                errorMsg += "Invalid Request.\n"
            }

            if (!params.product_sku)
            {
                isValid &&= false
                errorMsg += "Please do not leave the Product Id field blank.\n"
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