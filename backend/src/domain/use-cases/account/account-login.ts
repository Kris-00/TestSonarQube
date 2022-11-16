import { AccountLoginReqDto, AccountLoginResDto } from "../../interfaces/dto/account";
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { AccountRepository } from "../../interfaces/repositories/account-repository";
import { AccountLoginUseCase } from "../../interfaces/use-cases/account/account-login-use-case";
import * as util from '../../../utils/util'
import bcrypt from 'bcrypt';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Role } from "../../../middleware/auth.permission.middleware";

/*
*   AuthCode:
*   Unauthorized: -1
*   authorized: 0
*/
export class AccountLogin implements AccountLoginUseCase {
    accountRepository: AccountRepository
    constructor(accountRepository: AccountRepository) {
        this.accountRepository = accountRepository
    }

    async execute(loginCredentials: AccountLoginReqDto): Promise<AccountLoginResDto | null> {
        var res: AccountLoginResDto|null = null

        const account = await this.accountRepository.getUserByLogin(loginCredentials)

        if (account)
        {
            const result = await bcrypt.compare(loginCredentials.password, account.password_hash)

            if (result) // Correct Password
            {
                let scope = "account cart checkout"
                switch (account.role)
                {
                    case 1: //Customer
                        scope = "account cart checkout"
                        break
                    case 2: //Vendor
                        scope = "account store product sales report"
                        break
                    case 4: //Admin
                        scope = "account vendor"
                        break
                }

                var id = (account.role === Role.Admin) ? account.admin.adminId : (account.role === Role.Vendor) ? account.vendor.vendorId : account.customer.customerId
                var name = (account.role === Role.Admin) ? `${account.admin.first_name} ${account.admin.last_name}` : (account.role === Role.Vendor) ? `${account.vendor.store_name}` : `${account.customer.first_name} ${account.customer.last_name}`
                var role_name = (account.role === Role.Admin) ? "Admin": (account.role === Role.Vendor) ? "Vendor" : "Customer"
                
                // Generate JWT Token (Sign with RSA SHA256)
                var privateKey = fs.readFileSync(process.env.JWT_KEY_PATH!);
                var token = jwt.sign(
                    { unique_num: id, userid: account.accountId, scope: scope, name: name, email: account.email, role: role_name }, 
                    { key: privateKey, passphrase: process.env.JWT_KEY_CATCHPHRASE! }, 
                    { algorithm: 'RS256', expiresIn: '2h' }
                );

                res = {
                    statusCode: 200,
                    message: "Login Success",
                    authCode: 0,
                    token: token
                }
            }
            else // Incorrect Password
            {
                res = {
                    statusCode: 400,
                    message: "Either the email/password is incorrect, please try again.",
                    token: undefined,
                    authCode: -1
                }         
            }
        } else 
        {
            res = {
                statusCode: 400,
                message: "Either the email/password is incorrect, please try again.",
                token: undefined,
                authCode: -1
            }   
        }

        return res
    }

    validate(loginCredentials: AccountLoginReqDto): GeneralValidationDto {
        var isValid = true
        var errorMsg = ""
        
        if (!loginCredentials || (!loginCredentials.email && !loginCredentials.password))
        {
            isValid &&= false
            errorMsg += "Invalid login request"
            
        } 
        else 
        {
            if (loginCredentials.email === null || loginCredentials.email === null || !loginCredentials)
            {
                isValid &&= false;
                errorMsg += "Please do not leave the 'email' field blank.\n"
            }
            else if (!util.is_valid_email(loginCredentials.email))
            {
                isValid &&= false;
                errorMsg += "Invalid email address.\n"
            }

            if (loginCredentials.password === null || loginCredentials.password === null || !loginCredentials)
            {
                isValid &&= false;
                errorMsg += "Please do not leave the 'password' field blank.\n"
            }
        }

        return { isValid: isValid, message: errorMsg }
    }
}