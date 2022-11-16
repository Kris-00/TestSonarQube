import { UpdateCartItemReqDto, UpdateCartItemResDto } from '../../dto/order';
import { GeneralValidationDto } from '../../dto/validation';

export interface UpdateCartItemUseCase {
    execute(params: UpdateCartItemReqDto): Promise<UpdateCartItemResDto | null>;
    validate(params: UpdateCartItemReqDto): GeneralValidationDto;
}