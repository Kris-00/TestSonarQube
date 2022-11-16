import { GetVendorProductListReqDto, GetVendorProductListResDto } from '../../dto/product';
import { GeneralValidationDto } from '../../dto/validation';

export interface GetProductsUseCase {
    execute(params: GetVendorProductListReqDto): Promise<GetVendorProductListResDto | null>;
    validate(params: GetVendorProductListReqDto): GeneralValidationDto;
}