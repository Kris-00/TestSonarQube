import { GetProductDetailReqDto, ProductDto } from '../../dto/product';
import { GeneralValidationDto } from '../../dto/validation';

export interface CustomerGetCatalogProductDetailUseCase {
    execute(params: GetProductDetailReqDto): Promise<ProductDto | null>;
    validate(params: GetProductDetailReqDto): GeneralValidationDto;
}