import moment from 'moment';
import { AddProductReqDto, AddProductResDto } from '../../interfaces/dto/product';
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { ProductRepository } from "../../interfaces/repositories/product-repository";
import { AddProductUseCase } from '../../interfaces/use-cases/vendor/add-product-use-case';
import { v2 as cloudinary } from 'cloudinary';
import * as util from '../../../utils/util';
import { unescape } from 'querystring';

export class AddProduct implements AddProductUseCase {
    productRepository: ProductRepository
    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository
    }

    async execute(params: AddProductReqDto): Promise<AddProductResDto | null> {
        let response: AddProductResDto|null = null
        
        const existingProduct = await this.productRepository.getProductByName({ filter_params: params.product_name!, product_sku: '', vendor_id: params.vendor_id })

        if (existingProduct)
        {
            response = {
                statusCode: 400,
                message: `There exists a product with the same name '${decodeURI(params.product_name!)}'`
            }
        }
        else
        {
            const image_upload_result = await util.upload_image_to_cloudinary(params.product_image!)
            
            if (image_upload_result)
            {
                params.product_image = image_upload_result.secure_url // image_upload_result.url

                const storeItems = await this.productRepository.getProductList({ vendor_id: params.vendor_id })
                const sku = `FL${String((params.vendor_id! * 10000) + storeItems.length + 1)}`
                params.product_sku = sku
                params.product_price = params.product_price!*100
                
                const result = await this.productRepository.addProduct(params)
                
                if (result)
                {
                    response = {
                        statusCode: 200,
                        message: `Successfully added product to store.`
                    }
                }
                else 
                {
                    response = {
                        statusCode: 400,
                        message: `Unable to add product, please try again.`
                    }
                }
            }
            else
            {
                response = {
                    statusCode: 500,
                    message: "Something went wrong when trying to upload the product image."
                }
            }
        }
        
        return response
    }
    
    validate(params: AddProductReqDto): GeneralValidationDto {
        var isValid = true
        var errorMsg = ""

        if (params)
        {
            if (!params.product_name) {
                isValid &&= false
                errorMsg += "Please do not leave the 'Product Name' field blank.\n"
            }
            else if (params.product_name.length > 250)
            {
                isValid &&= false
                errorMsg += "The product name is too long, maximum of 250 characters."
            }

            if (!params.product_price) {
                isValid &&= false
                errorMsg += "Please do not leave the 'Product Price' field blank.\n"
            }
            else if (!util.is_price_decimal(String(params.product_price)))
            {
                isValid &&= false
                errorMsg += "Invalid price value provided, the price value should only have a maxmium of 2 decimal places\n"
            }

            if (!params.product_image) {
                isValid &&= false
                errorMsg += "Please do not leave the 'Product Image' field blank.\n"
            }
            else if (!util.is_valid_base64_str)
            {
                isValid &&= false
                errorMsg += "The Image you are trying to upload is invalid, please try again.\n"
            }
            else if (!util.is_valid_img_file(params.product_image))
            {
                isValid &&= false
                errorMsg += "Invalid image file, please try again.\n"
            }
            else if (!util.is_valid_img_file_size(params.product_image))
            {
                isValid &&= false
                errorMsg += `The image file size exceeds ${util.MAX_IMG_FILE_SIZE_TXT}.\n`
            }
            
            if (!params.product_stock) {
                isValid &&= false
                errorMsg += "Please do not leave the 'Product Initial Stock' field blank.\n"
            }

            if (!params.category)
            {
                isValid &&= false
                errorMsg += "Please do not leave the 'Product Category' field blank.\n"
            }
            else if (params.category.length > 250)
            {
                isValid &&= false
                errorMsg += "The category name is too long, maximum of 250 characters.\n"
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