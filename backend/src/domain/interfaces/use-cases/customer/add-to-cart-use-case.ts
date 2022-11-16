import { AddToCartReqDto, AddtoCartResDto } from '../../dto/order';
import { GeneralValidationDto } from '../../dto/validation';

export interface AddToCartUseCase {
    execute(params: AddToCartReqDto): Promise<AddtoCartResDto | null>;
    validate(params: AddToCartReqDto): GeneralValidationDto;
}