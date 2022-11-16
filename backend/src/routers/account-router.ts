import { PrismaClient } from '@prisma/client'
import moment from 'moment'
import express from 'express'
import { Request, Response } from 'express'
import { AccountLoginResDto } from '../domain/interfaces/dto/account'
import { AccountLoginUseCase } from '../domain/interfaces/use-cases/account/account-login-use-case'
import { CustomerRegistrationUseCase } from '../domain/interfaces/use-cases/account/customer-registration-use-case'
import { CustomerGetAccountDetailsUseCase } from '../domain/interfaces/use-cases/customer/get-account-details-use-case'
import { CustomerUpdateAccountDetailsUseCase } from '../domain/interfaces/use-cases/customer/update-account-details-use-case'
import { ResetPasswordUseCase } from '../domain/interfaces/use-cases/account/reset-password-use-case'
import * as Auth from '../middleware/auth.validation.middleware'
import { minimumPermissionLevelRequired, Role } from '../middleware/auth.permission.middleware'
import * as util from '../utils/util'
import crypto from 'crypto'

export default function AccountRouter(
    accountLogin: AccountLoginUseCase, 
    customerRegistration: CustomerRegistrationUseCase,
    customerGetAccountDetails: CustomerGetAccountDetailsUseCase,
    customerUpdateAccountDetails: CustomerUpdateAccountDetailsUseCase,
    resetPassword: ResetPasswordUseCase) {
    const router = express.Router()

    router.post('/login', async(req: Request, res: Response) => {
        try {
            const loginCredentials = {
                email: util.normalise_email(req.body.email),
                password: util.sanitize(req.body.password, false)
            }
            
            const validationResult = await accountLogin.validate(loginCredentials)

            if (validationResult.isValid)
            {
                const loginRes: AccountLoginResDto | null = await accountLogin.execute(loginCredentials)

                // Correct password
                if (loginRes!.statusCode == 200)
                {
                    let token = loginRes!.token
                    // 'expires' option: Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.
                    // 'maxAge' option: Convenient option for setting the expiry time relative to the current time in milliseconds.
                    // 'secure' option: Marks the cookie to be used with HTTPS only.
                    // 'signed' option: Indicates if the cookie should be signed.
                    res.cookie('token', token, { httpOnly: false, expires: undefined, secure: false }).status(200).send(loginRes)
                }
                else // Incorrect password
                {
                    let statusCode = loginRes!.statusCode!
                    loginRes!.statusCode = undefined
                    res.clearCookie('token').status(statusCode).send(loginRes)
                }
            }
            else
            {
                res.clearCookie('token').status(400).send({ message: validationResult.message })
            }
        } catch(err) {
            /**
             * TODO: Log error (Server Side)
            */
           console.log(err)
            res.clearCookie('token').status(500).send({ message: "Invalid request"})
        }
    })

    router.post('/register', async(req: Request, res: Response) => {
        try {
            const accountDetails = {
                first_name: util.sanitize(req.body.first_name),
                last_name: util.sanitize(req.body.last_name),
                dob: util.sanitize(req.body.dob),
                email: req.body.email,
                password: util.sanitize(req.body.password, false),
                role: 1
            }

            const validationResult = await customerRegistration.validate(accountDetails)

            if (validationResult.isValid)
            {
                accountDetails.dob = moment.utc(accountDetails.dob, "YYYY-MM-DD").toISOString()
                const regResponse = await customerRegistration.execute(accountDetails)
                let statusCode = regResponse!.statusCode!
                regResponse!.statusCode = undefined

                // send response to user
                res.status(statusCode).send(regResponse?.message)
            }
            else 
            {
                res.status(400).send({ message: validationResult.message })
            }
        } catch (err) {
            console.log(err)
            res.clearCookie('token').status(500).send({ message: "Invalid request" })
        }
    })

    router.get('/:accountid', [
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Admin),
        async (req: Request, res: Response) => {}
    ])

    router.get('/', [
        Auth.validJWTNeeded, 
        minimumPermissionLevelRequired(Role.Customer|Role.Admin|Role.Vendor), 
        async (req: Request, res: Response) => {
            console.log("hello")
            try
            {
                var accountDetails = {
                    tokenUserId: req.body.userid,
                    id: req.body.accountId,
                    email: req.body.email
                }
    
                const validationResult = await customerGetAccountDetails.validate(accountDetails)
                req.body.userid = undefined
    
                if (validationResult.isValid)
                {
                    const response = await customerGetAccountDetails.execute(accountDetails)
                    response!.accountId = undefined
                    let statusCode = response!.statusCode!
                    response!.statusCode = undefined
                    response!.message = undefined

                    return res.status(200).send(response)
                }
                else
                {
                    return res.status(400).send({ message: validationResult.message })
                }
            }
            catch(err) 
            {
                console.log(err)
                return res.status(500).send({ message: "Invalid request" })
            }
        }
    ])

    router.put('/', [
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Customer|Role.Vendor|Role.Admin),
        async (req: Request, res: Response) => {
            try{
                const accountDetails = {
                    accountId: util.sanitize(req.body.userid),
                    prev_password: util.sanitize(req.body.prev_password),
                    first_name: util.sanitize(req.body.first_name),
                    last_name: util.sanitize(req.body.last_name),
                    dob: util.sanitize(req.body.dob),
                    email: util.normalise_email(req.body.email),
                    password: util.sanitize(req.body.password),
                    updated_at: req.body.updated_at
                }

                const validationResult = await customerUpdateAccountDetails.validate(accountDetails)
                req.body.userid = undefined

                if (validationResult.isValid)
                {
                    accountDetails.dob = moment.utc(accountDetails.dob, "YYYY-MM-DD").toISOString()
                    const response = await customerUpdateAccountDetails.execute(accountDetails)

                    if (response)
                    {
                        let statusCode = response!.statusCode!
                        response!.statusCode = undefined

                        return res.status(statusCode).send(response)
                    }
                    else
                    {
                        return res.status(400).send({ message: "Invalid request" })
                    }
                }
                else
                {
                    return res.status(400).send({ message: validationResult.message })
                }
            }
            catch(err)
            {
                console.log(err)
                return res.status(500).send({ message: "Invalid request" })
            }
        }
    ])

    router.post('/reset', async (req: Request, res: Response) => {
        try
        {
            const params = {
                accountId: undefined,
                email: req.body.email,
                token: req.body.token,
                password: req.body.password,
                type: 1 // Send email
            }

            const validationResult = await resetPassword.validate(params)

            if (validationResult.isValid)
            {
                const result = await resetPassword.execute(params)

                if (result)
                {
                    return res.status(result.statusCode!).send(result)
                }
                else
                {
                    return res.status(400).send({ message: "Invalid request" })
                }
            }
            else
            {
                return res.status(400).send({ message: validationResult.message })
            }
        }
        catch (err)
        {
            console.log("[RESET PASSWORD]", err)
            return res.status(500).send({ message: "Something went wrong trying to process the request." })
        }
    })

    router.put('/reset', async (req: Request, res: Response) => {
        try
        {
            const params = {
                accountId: undefined,
                email: req.body.email,
                token: req.body.token,
                password: req.body.password,
                type: 2 // Reset password
            }

            const validationResult = await resetPassword.validate(params)

            if (validationResult.isValid)
            {
                const result = await resetPassword.execute(params)

                if (result)
                {
                    return res.status(result.statusCode!).send(result)
                }
                else
                {
                    return res.status(400).send({ message: "Invalid request" })
                }
            }
            else
            {
                return res.status(400).send({ message: validationResult.message })
            }
        }
        catch (err)
        {
            console.log(err)
            return res.status(500).send({ message: "Something went wrong trying to process the request." })
        }
    })

    return router
}