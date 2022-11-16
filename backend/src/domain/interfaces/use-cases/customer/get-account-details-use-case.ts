import { GetSingleCustomerAccountReqDto, GetSingleCustomerAccountResDto } from '../../dto/account';
import { GeneralValidationDto } from '../../dto/validation';

export interface CustomerGetAccountDetailsUseCase {
    execute(accountDetails: GetSingleCustomerAccountReqDto): Promise<GetSingleCustomerAccountResDto | null>;
    validate(accountDetails: GetSingleCustomerAccountReqDto): GeneralValidationDto;
}