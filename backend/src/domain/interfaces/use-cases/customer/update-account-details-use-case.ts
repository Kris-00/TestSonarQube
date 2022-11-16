import { CustomerUpdateAccountReqDto, CustomerUpdateAccountResDto } from "../../dto/account"
import { GeneralValidationDto } from "../../dto/validation";

export interface CustomerUpdateAccountDetailsUseCase {
    execute(accountDetails: CustomerUpdateAccountReqDto): Promise<CustomerUpdateAccountResDto | null>;
    validate(accountDetails: CustomerUpdateAccountReqDto): GeneralValidationDto;
}