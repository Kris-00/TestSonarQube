import { DeleteProductReqDto, DeleteProductResDto } from '../../dto/product';
import { GeneralValidationDto } from '../../dto/validation';

export interface DeleteProductUseCase {
    execute(params: DeleteProductReqDto): Promise<DeleteProductResDto | null>;
    validate(params: DeleteProductReqDto): GeneralValidationDto;
}