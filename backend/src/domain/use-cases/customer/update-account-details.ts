const TAG = "CUSTOMER_UPDATE_ACC_DETAILS"
import { Prisma } from "@prisma/client"
import { CustomerUpdateAccountReqDto, CustomerUpdateAccountResDto } from "../../interfaces/dto/account"
import { GeneralValidationDto } from "../../interfaces/dto/validation"
import { AccountRepository } from "../../interfaces/repositories/account-repository"
import { CustomerUpdateAccountDetailsUseCase } from "../../interfaces/use-cases/customer/update-account-details-use-case"
import * as util from'../../../utils/util'
import moment from 'moment'
import bcrypt from 'bcrypt'

export class CustomerUpdateAccountDetails  implements CustomerUpdateAccountDetailsUseCase {
    accountRepository: AccountRepository
    constructor(accountRepository: AccountRepository) {
        this.accountRepository = accountRepository
    }

    async execute(accountDetails: CustomerUpdateAccountReqDto): Promise<CustomerUpdateAccountResDto | null> {
        let response: CustomerUpdateAccountResDto|null = null

        try
        {
            const currentRecord = await this.accountRepository.getAccountById(accountDetails.accountId!)
            if (currentRecord)
            {
                const currentUpdatedAt = moment(currentRecord.updatedAt).valueOf()
                const isPwdMatch = await bcrypt.compare(accountDetails.prev_password!, currentRecord.password_hash!)

                if (!isPwdMatch)
                {
                    response = {
                        statusCode: 400,
                        message: "Please ensure that the password you have provided is correct."
                    }
                }
                else if (currentUpdatedAt === accountDetails.updated_at)
                {
                    let tempPwd = accountDetails.password
                    
                    if (tempPwd)
                        accountDetails.password = await bcrypt.hash(tempPwd, 15)
                    else
                        accountDetails.password = currentRecord.password_hash
                    
                    const result = await this.accountRepository.updateAccount(accountDetails)
                    response = {
                        statusCode: 200,
                        message: "Successfully updated account details."
                    }
                }
                else
                {
                    response = {
                        statusCode: 400,
                        message: `It seems that the account details was updated recently, please refresh and try again.`
                    }
                }
            }
        }
        catch(err)
        {
            console.log(`[${TAG}] `, err)

            if (err instanceof Prisma.PrismaClientKnownRequestError)
            {
                // Ref: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
                switch (err.code)
                {
                    case 'P2002':
                        response = {
                            statusCode: 400,
                            message: `An account with the email \'${accountDetails.email}\' exists.`
                        }
                        break
                    default:
                        response = {
                            statusCode: 500,
                            message: "Unable to process the request, please try again."
                        }
                        break
                }
            }
            else
            {
                response = {
                    statusCode: 500,
                    message: "Unable to process the request, please try again."
                }
            }
        }

        return response
    }

    validate(accountDetails: CustomerUpdateAccountReqDto): GeneralValidationDto {
        var isValid = true
        var errorMsg = ""

        if (!accountDetails)
        {
            isValid &&= false
            errorMsg += "Invalid request, please ensure that all required fields are present.\n"
        }
        else
        {
            if (!accountDetails.accountId)
            {
                isValid &&= false
                errorMsg += "Please do not leave the \'accountId\' field blank.\n"
            }

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

            if (!accountDetails.prev_password)
            {
                isValid &&= false
                errorMsg += "Please do not leave the \'Password\' field blank.\n"
            }

            if (accountDetails.password && !util.is_complex_password(accountDetails.password))
            {
                isValid &&= false
                errorMsg += "Please ensure the your new passowrd meet the following requirements:\n- Contains 1 uppercase letters\n- Contains 1 special character\n- Contains 2 Digits\n- Contains at least 3 lowercase letters\n- Length of password is at least 8 characters\n"
            }

            if (!accountDetails.dob)
            {
                isValid &&= false
                errorMsg += "Please do not leave the \'Date of Birth\' field blank.\n"
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

            if (!accountDetails.updated_at)
            {
                isValid &&= false
                errorMsg += "Please do not leave the \'updated_at\' field blank.\n"
            }
        }

        return { isValid: isValid, message: errorMsg }
    }
}