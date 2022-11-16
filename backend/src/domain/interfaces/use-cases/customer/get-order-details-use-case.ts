import { GetOrderReqDto, GetOrderResDto } from '../../dto/order';
import { GeneralValidationDto } from '../../dto/validation';

export interface CustomerGetOrderDetailsUseCase {
    execute(params: GetOrderReqDto): Promise<GetOrderResDto | null>;
    validate(params: GetOrderReqDto): GeneralValidationDto;
}