import { RemoveFromCartReqDto, RemoveFromCartResDto } from '../../dto/order';
import { GeneralValidationDto } from '../../dto/validation';

export interface RemoveFromCartUseCase {
    execute(params: RemoveFromCartReqDto): Promise<RemoveFromCartResDto | null>;
    validate(params: RemoveFromCartReqDto): GeneralValidationDto;
}