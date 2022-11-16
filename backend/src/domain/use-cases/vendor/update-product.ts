import moment from 'moment';
import { UpdateProductReqDto, UpdateProductResDto } from '../../interfaces/dto/product';
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { ProductRepository } from "../../interfaces/repositories/product-repository";
import { UpdateProductUseCase } from '../../interfaces/use-cases/vendor/update-product-use-case';
import * as util from '../../../utils/util';

export class UpdateProduct implements UpdateProductUseCase {
    productRepository: ProductRepository
    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository
    }

    async execute(params: UpdateProductReqDto): Promise<UpdateProductResDto | null> {
        let response: UpdateProductResDto|null = null

        const existingProduct = await this.productRepository.getProduct({ vendor_id: params.vendor_id, product_sku: params.product_sku!, filter_params: undefined })
        const duplicateProduct = await this.productRepository.getProductByName({ vendor_id: params.vendor_id!, filter_params: params.product_name, product_sku: undefined })

        if (existingProduct)
        {
            // Update ProductID into the params
            params.product_id = existingProduct.product.productId
            
            if (duplicateProduct && (existingProduct.product.product_id !== duplicateProduct.product.product_id))
            {
                response = {
                    statusCode: 400,
                    message: `There exist another product with the name ${duplicateProduct.product.product_name}`
                }
            }
            else if (moment(existingProduct.updatedAt).valueOf() === params.updated_at)
            {
                if (params.product_image && !params.product_image.startsWith('https://res.cloudinary.com/dj6afbyih'))
                {
                    const image_upload_result = await util.upload_image_to_cloudinary(params.product_image!)

                    if (image_upload_result)
                        params.product_image = image_upload_result.secure_url // image_upload_result.url
                    else
                        return response = {
                            statusCode: 400,
                            message: "Unable to upload the produc timage"
                        }
                }

                params.product_price! *= 100
                const result = await this.productRepository.updateProduct(params)

                if (result)
                {
                    response = {
                        statusCode: 200,
                        message: "Successfully updated product details."
                    }
                }
                else
                {
                    response = {
                        statusCode: 400,
                        message: "Unable to update the product details, please try again."
                    }
                }
            }
            else
            {
                response = {
                    statusCode: 400,
                    message: `It seems that the product details was updated recently, please refresh and try again.`
                }
            }
        }
        else
        {
            response = {
                statusCode: 400,
                message: "The product does not exist to be updated."
            }
        }

        return response
    }

    validate(params: UpdateProductReqDto): GeneralValidationDto {
        var isValid = true
        var errorMsg = ""

        if (params && params.updated_at)
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

            if (params.product_image) {
                if (params.product_image.toString().startsWith('https://res.cloudinary.com/dj6afbyih')) {
                    isValid &&= true
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