import { ResetPasswordReqDto, ResetPasswordResDto } from "../../interfaces/dto/account";
import { GeneralValidationDto } from '../../interfaces/dto/validation';
import { AccountRepository } from "../../interfaces/repositories/account-repository";
import { ResetPasswordUseCase } from "../../interfaces/use-cases/account/reset-password-use-case";
import sgMail from '@sendgrid/mail';
import * as util from '../../../utils/util'
import bcrypt from 'bcrypt';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Role } from "../../../middleware/auth.permission.middleware";

export class ResetPassword implements ResetPasswordUseCase {
    accountRepository: AccountRepository
    constructor(accountRepository: AccountRepository) {
        this.accountRepository = accountRepository
    }

    async execute(params: ResetPasswordReqDto): Promise<ResetPasswordResDto | null> {
        let res: ResetPasswordResDto|null = null

        const existingEmail = await this.accountRepository.getAccountByEmail(params.email!)
        let ENC_KEY = Buffer.from(process.env.RESET_TOKEN_ENC_KEY!, "hex")
        let IV = Buffer.from(process.env.RESET_TOKEN_ENC_IV!, "hex")
        console.log(ENC_KEY.length, IV.length)

        if (existingEmail)
        {
            if (params.type === 1) // Send email
            {
                // Generate JWT Token
                var token = jwt.sign(
                    { userid: existingEmail.accountId }, 
                    process.env.JWT_SECRET!, 
                    { expiresIn: '1h' }
                );

                const frontendUri = 'https://team45salesapp.tk'
                const text = `Your verification code is ${token}.\r\nTo reset your password please goto: ${frontendUri}/accounts/changepassword?token=${token}`
                const html = `<p>Your verification code is ${token}.</p><br/><p>To reset your password click <a href="${frontendUri}/accounts/changepassword?token=${token}">here</a>.</p>`

                const msg = {
                    to: params.email!,
                    from: 'fakelazadahelpdesk@outlook.com',
                    subject: 'Reset Account Password',
                    text: text,
                    html: html
                }
                
                const emailResult = await sgMail.send(msg)
                
                if (!emailResult)
                {
                    return res = {
                        statusCode: 500,
                        message: "Something went wrong when processing the request, please try again."
                    }
                }
                else
                {
                    let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV)
                    let encrypted = cipher.update(token, 'utf8', 'base64')
                    encrypted += cipher.final('base64')

                    params.token = encrypted
                    const result = await this.accountRepository.addResetPasswordToken(params)

                    if (!result)
                        return res = {
                            statusCode: 500,
                            message: "Something went wrong when processing the request, please try again."
                        }
                    else
                        return res = {
                            statusCode: 200,
                            message: "Successfully sent the email to reset your account password, please check your inbox/junk mailbox"
                        }
                }
            }
            else if (params.type === 2) // Reset Password
            {
                // Check if token is valid
                const result = await this.accountRepository.getResetToken(params)

                if (result)
                {
                    let token = result.reset_token
                    let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV)
                    let decrypted = decipher.update(token, 'base64', 'utf8')
                    decrypted += decipher.final('utf8')

                    try
                    {
                        const hash = await bcrypt.hash(params.password!, 15)
                        const decoded:any = jwt.verify(decrypted, process.env.JWT_SECRET!);
                        params.accountId = decoded.userid
                        params.password = hash

                        const result = await this.accountRepository.updateNewPassword(params)

                        if (!result)
                        {
                            return res = {
                                statusCode: 400,
                                message: "Invalid request"
                            }
                        }
                        else
                        {
                            return res = {
                                statusCode: 200,
                                message: "Your password has been reset, try logging in now."
                            }
                        }
                    }
                    catch(err)
                    {
                        return res = {
                            statusCode: 400,
                            message: "Invalid reset password request."
                        }
                    }
                }
                else
                {
                    return res = {
                        statusCode: 400,
                        message: "Invalid reset password request."
                    }
                }
            }
            else
            {
                res = {
                    statusCode: 400,
                    message: "Invalid request"
                }
            }
        }

        return res
    }

    validate(params: ResetPasswordReqDto): GeneralValidationDto {
        var isValid = true
        var errorMsg = ""

        if (params.type === 1)
        {
            if (!params.email)
            {
                isValid &&= false
                errorMsg += "Please do not leave the 'email' field blank.\n"
            }
            else if (!util.is_valid_email(params.email)) 
            {
                isValid &&= false
                errorMsg += "Please ensure that the email you have provided is valid.\n"
            }
        }
        else if (params.type === 2)
        {
            if (!params.email)
            {
                isValid &&= false
                errorMsg += "Please do not leave the 'email' field blank.\n"
            }
            else if (!util.is_valid_email(params.email)) 
            {
                isValid &&= false
                errorMsg += "Please ensure that the email you have provided is valid.\n"
            }

            if (!params.token)
            {
                isValid &&= false
                errorMsg += "Please do not leave the 'token' field blank.\n"
            }

            if (!params.password)
            {
                isValid &&= false
                errorMsg += "Please do not leave the 'password' field blank.\n"
            }
            else if (!util.is_complex_password(params.password))
            {
                isValid &&= false
                errorMsg += "Please ensure the your passowrd meet the following requirements:\n- Contains 1 uppercase letters\n- Contains 1 special character\n- Contains 2 Digits\n- Contains at least 3 lowercase letters\n- Length of password is at least 8 characters\n"
            }
        }
        else
        {
            isValid &&= false
            errorMsg = "Invalid request"
        }
        return { isValid: isValid, message: errorMsg }
    }
}