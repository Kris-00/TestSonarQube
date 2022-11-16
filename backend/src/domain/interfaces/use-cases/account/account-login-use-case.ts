import { AccountLoginReqDto, AccountLoginResDto } from "../../dto/account";
import { GeneralValidationDto } from '../../dto/validation';

export interface AccountLoginUseCase {
    execute(loginCredentials: AccountLoginReqDto): Promise<AccountLoginResDto | null>;
    validate(loginCredentials: AccountLoginReqDto): GeneralValidationDto;
}