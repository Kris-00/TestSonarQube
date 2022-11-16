import { GetCartItemsReqDto, GetCartItemsResDto } from '../../dto/order';
import { GeneralValidationDto } from '../../dto/validation';

export interface GetCartItemsUseCase {
    execute(params: GetCartItemsReqDto): Promise<GetCartItemsResDto | null>;
    validate(params: GetCartItemsReqDto): GeneralValidationDto;
}