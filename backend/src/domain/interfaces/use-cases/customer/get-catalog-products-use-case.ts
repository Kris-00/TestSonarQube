import { GetCatalogReqDto, ProductListDto } from '../../dto/product';
import { GeneralValidationDto } from '../../dto/validation';

export interface CustomerGetCatalogProductsUseCase {
    execute(params: GetCatalogReqDto): Promise<ProductListDto | null>;
    validate(params: GetCatalogReqDto): GeneralValidationDto;
}