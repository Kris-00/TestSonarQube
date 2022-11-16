import { GetVendorProductDetailsReqDto, GetVendorProductDetailsResDto } from '../../dto/product';
import { GeneralValidationDto } from '../../dto/validation';

export interface GetProductDetailsUseCase {
    execute(params: GetVendorProductDetailsReqDto): Promise<GetVendorProductDetailsResDto | null>;
    validate(params: GetVendorProductDetailsReqDto): GeneralValidationDto;
}