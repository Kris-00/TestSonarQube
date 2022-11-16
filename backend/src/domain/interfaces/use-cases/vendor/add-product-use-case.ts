import { AddProductReqDto, AddProductResDto } from '../../dto/product';
import { GeneralValidationDto } from '../../dto/validation';

export interface AddProductUseCase {
    execute(params: AddProductReqDto): Promise<AddProductResDto | null>;
    validate(params: AddProductReqDto): GeneralValidationDto;
}