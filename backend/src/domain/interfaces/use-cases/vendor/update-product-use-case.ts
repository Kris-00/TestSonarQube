import { UpdateProductReqDto, UpdateProductResDto } from '../../dto/product';
import { GeneralValidationDto } from '../../dto/validation';

export interface UpdateProductUseCase {
    execute(params: UpdateProductReqDto): Promise<UpdateProductResDto | null>;
    validate(params: UpdateProductReqDto): GeneralValidationDto;
}