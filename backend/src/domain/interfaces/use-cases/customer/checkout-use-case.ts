import { CheckoutReqDto, CheckoutResDto } from '../../dto/order';
import { GeneralValidationDto } from '../../dto/validation';

export interface CheckoutUseCase {
    execute(params: CheckoutReqDto): Promise<CheckoutResDto | null>;
    validate(params: CheckoutReqDto): GeneralValidationDto;
}