import moment from 'moment';
import { GetSingleCustomerAccountReqDto, GetSingleCustomerAccountResDto } from '../../interfaces/dto/account';
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { AccountRepository } from "../../interfaces/repositories/account-repository";
import { CustomerGetAccountDetailsUseCase } from '../../interfaces/use-cases/customer/get-account-details-use-case';

export class CustomerGetAccountDetails implements CustomerGetAccountDetailsUseCase {
    accountRepository: AccountRepository
    constructor(accountRepository: AccountRepository) {
        this.accountRepository = accountRepository
    }

    async execute(accountDetails: GetSingleCustomerAccountReqDto): Promise<GetSingleCustomerAccountResDto | null> {
        let response: GetSingleCustomerAccountResDto|null = null

        const result = await this.accountRepository.getAccountById(accountDetails.tokenUserId!)
        
        if (result)
        {
            response = {
                statusCode: 200,
                message: undefined,
                accountId: undefined,
                first_name: (result.customer) ? decodeURI(result.customer.first_name): "",
                last_name: (result.customer) ? decodeURI(result.customer.last_name): "",
                email: result.email,
                dob: (result.customer) ? moment(result.customer.dob).format('YYYY-MM-DD'): "",
                role: undefined,
                is_deleted: undefined,
                updated_at: moment(result.updatedAt).valueOf()
            }
        }
        else
        {
            response = {
                statusCode: 404,
                message: "Account not found",
                accountId: undefined,
                first_name: undefined,
                last_name: undefined,
                email: undefined,
                dob: undefined,
                role: undefined,
                is_deleted: undefined,
                updated_at: undefined
            }
        }

        return response
    }

    validate(accountDetails: GetSingleCustomerAccountReqDto): GeneralValidationDto {
        var isValid = true
        var errorMsg = ""

        return { isValid: isValid, message: errorMsg }
    }
}