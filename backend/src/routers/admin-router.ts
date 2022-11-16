import moment from 'moment'
import express from 'express'
import { Request, Response } from 'express'
import * as Auth from '../middleware/auth.validation.middleware'
import { minimumPermissionLevelRequired, Role } from '../middleware/auth.permission.middleware'
import * as util from '../utils/util'
import { CreateVendorAccountUseCase } from '../domain/interfaces/use-cases/admin/create-vendor-acc-use-case'

export default function AdminRouter(
    createVendorAccount: CreateVendorAccountUseCase
) {
    const router = express.Router()

    router.post('/vendor', [
        Auth.validJWTNeeded, 
        minimumPermissionLevelRequired(Role.Admin), 
        async (req: Request, res: Response)=>{
            try {
                const params = {
                    store_name: util.sanitize(req.body.store_name),
                    email: util.normalise_email(req.body.email),
                    password: util.sanitize(req.body.password, false),
                    role: 2
                }
    
                const validationResult = await createVendorAccount.validate(params)
    
                if (validationResult.isValid)
                {
                    const regResponse = await createVendorAccount.execute(params)
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
        }])

    return router
}