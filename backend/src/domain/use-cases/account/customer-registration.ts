import { CustomerRegistrationUseCase } from "../../interfaces/use-cases/account/customer-registration-use-case";
import { CreateCustomerAccountReqDto, CreateCustomerAccountResDto } from "../../interfaces/dto/account";
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { AccountRepository } from "../../interfaces/repositories/account-repository";
import bcrypt from 'bcrypt'
import moment from 'moment'
import * as util from '../../../utils/util'

export class CustomerRegistration implements CustomerRegistrationUseCase {
    accountRepository: AccountRepository
    constructor(accountRepository: AccountRepository) {
        this.accountRepository = accountRepository
    }

    async execute(accountDetails: CreateCustomerAccountReqDto): Promise<CreateCustomerAccountResDto | null> {
        var password_plaintext = accountDetails.password
        var res: CreateCustomerAccountResDto | null = null

        const hash = await bcrypt.hash(password_plaintext, 15)
        accountDetails.password = hash
        
        const result = await this.accountRepository.createCustomerAccount(accountDetails)

        if (result.account)
        {
            res = {
                statusCode: 201,
                message: "Successfully created the account."
            }
        }
        else
        {
            res = {
                statusCode: 500,
                message: result.message!
            }
        }

        return res
    }

    validate(accountDetails: CreateCustomerAccountReqDto): GeneralValidationDto {
        var isValid = true
        var errorMsg = ""

        if (!accountDetails)
        {
            isValid &&= false
            errorMsg += "Invalid registeration request."
        }
        else
        {
            if (!accountDetails.email)
            {
                isValid &&= false
                errorMsg += "Please do not leave the \'Email\' field blank.\n"
            }
            else if (!util.is_valid_email(accountDetails.email)) 
            {
                isValid &&= false
                errorMsg += "Please ensure that the email you have provided is valid.\n"
            }

            if (!accountDetails.dob) 
            {
                isValid &&= false
                errorMsg += "Please do not leave the 'Date of Birth' field blank.\n"
            }
            else if (!(new RegExp(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)).test(accountDetails.dob)) 
            {
                isValid &&= false
                errorMsg += "Please ensure that the date format is in the \'YYYY-MM-DD\' format\n"
            }

            if (!accountDetails.first_name)
            {
                isValid &&= false
                errorMsg += "Please do not leave the \'First Name\' field blank.\n"
            }

            if (!accountDetails.last_name)
            {
                isValid &&= false
                errorMsg += "Please do not leave the \'Last Name\' field blank.\n"
            }

            if (!accountDetails.password)
            {
                isValid &&= false
                errorMsg += "Please do not leave the \'Password\' field blank.\n"
            }
            else if (!util.is_complex_password(accountDetails.password))
            {
                isValid &&= false
                errorMsg += "Please ensure the your passowrd meet the following requirements:\n- Contains 1 uppercase letters\n- Contains 1 special character\n- Contains 2 Digits\n- Contains at least 3 lowercase letters\n- Length of password is at least 8 characters\n"
            }
        }

        return { isValid: isValid, message: errorMsg }
    }
}