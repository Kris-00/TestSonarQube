import { CreateVendorAccountReqDto, CreateVendorAccountResDto } from "../../interfaces/dto/account";
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { AccountRepository } from "../../interfaces/repositories/account-repository";
import { CreateVendorAccountUseCase } from "../../interfaces/use-cases/admin/create-vendor-acc-use-case";
import * as util from '../../../utils/util'
import bcrypt from 'bcrypt';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Role } from "../../../middleware/auth.permission.middleware";

export class CreateVendorAccount implements CreateVendorAccountUseCase {
    accountRepository: AccountRepository
    constructor(accountRepository: AccountRepository) {
        this.accountRepository = accountRepository
    }

    async execute(params: CreateVendorAccountReqDto): Promise<CreateVendorAccountResDto | null> {
        let res: CreateVendorAccountResDto|null = null
        const existingAccount = await this.accountRepository.getAccountByEmail(params.email!)

        if (existingAccount)
        {
            return res = {
                statusCode: 400,
                message: `There is an existing account with the email ${params.email!}`
            }
        }
    
        var password_plaintext = params.password

        const hash = await bcrypt.hash(password_plaintext, 15)
        params.password = hash
        
        const result = await this.accountRepository.createVendorAccount(params)
        console.log(result)

        if (result)
        {
            res = {
                statusCode: 201,
                message: "Successfully created the account."
            }
        }
        else
        {
            console.log(result)
            res = {
                statusCode: 500,
                message: result.message!
            }
        }

        return res
    }

    validate(params: CreateVendorAccountReqDto): GeneralValidationDto {
        var isValid = true
        var errorMsg = ""

        if (!params)
        {
            isValid &&= false
            errorMsg += "Invalid registeration request."
        }
        else
        {
            if (!params.email)
            {
                isValid &&= false
                errorMsg += "Please do not leave the \'Email\' field blank.\n"
            }
            else if (!util.is_valid_email(params.email)) 
            {
                isValid &&= false
                errorMsg += "Please ensure that the email you have provided is valid.\n"
            }

            if (!params.store_name)
            {
                isValid &&= false
                errorMsg += "Please do not leave the \'Store Name\' field blank.\n"
            }

            if (!params.password)
            {
                isValid &&= false
                errorMsg += "Please do not leave the \'Password\' field blank.\n"
            }
            else if (!util.is_complex_password(params.password))
            {
                isValid &&= false
                errorMsg += "Please ensure the your passowrd meet the following requirements:\n- Contains 1 uppercase letters\n- Contains 1 special character\n- Contains 2 Digits\n- Contains at least 3 lowercase letters\n- Length of password is at least 8 characters\n"
            }
        }

        return { isValid: isValid, message: errorMsg }
    }
}