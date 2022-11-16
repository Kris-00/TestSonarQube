import { GetOrderHistoryReqDto, GetOrderHistoryResDto } from '../../dto/order';
import { GeneralValidationDto } from '../../dto/validation';

export interface CustomerGetOrderHistoryUseCase {
    execute(params: GetOrderHistoryReqDto): Promise<GetOrderHistoryResDto | null>;
    validate(params: GetOrderHistoryReqDto): GeneralValidationDto;
}