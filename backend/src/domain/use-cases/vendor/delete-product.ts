import moment from 'moment';
import { DeleteProductReqDto, DeleteProductResDto } from '../../interfaces/dto/product';
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { ProductRepository } from "../../interfaces/repositories/product-repository";
import { DeleteProductUseCase } from '../../interfaces/use-cases/vendor/delete-product-use-case';

export class DeleteProduct implements DeleteProductUseCase {
    productRepository: ProductRepository
    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository
    }

    async execute(params: DeleteProductReqDto): Promise<DeleteProductResDto | null> {
        let response: DeleteProductResDto|null = null
        const result = await this.productRepository.deleteProduct(params)

        if (result)
        {
            response = {
                statusCode: 200,
                message: "Successfully deleted the product"
            }
        }
        else
        {
            response = {
                statusCode: 400,
                message: "Unable to delete the product"
            }
        }

        return response
    }

    validate(params: DeleteProductReqDto): GeneralValidationDto {
        var isValid = true
        var errorMsg = ""

        return { isValid: isValid, message: errorMsg }
    }
}