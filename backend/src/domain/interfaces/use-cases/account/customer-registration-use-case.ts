import { CreateCustomerAccountReqDto, CreateCustomerAccountResDto } from "../../dto/account";
import { GeneralValidationDto } from '../../dto/validation';

export interface CustomerRegistrationUseCase {
    execute(accountDetails: CreateCustomerAccountReqDto): Promise<CreateCustomerAccountResDto | null>;
    validate(accountDetails: CreateCustomerAccountReqDto): GeneralValidationDto;
}