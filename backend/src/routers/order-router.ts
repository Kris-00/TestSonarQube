import moment from 'moment'
import express from 'express'
import { Request, Response } from 'express'
import * as Auth from '../middleware/auth.validation.middleware'
import { minimumPermissionLevelRequired, Role } from '../middleware/auth.permission.middleware'
import * as util from '../utils/util'
import { CustomerGetOrderHistoryUseCase } from '../domain/interfaces/use-cases/customer/get-order-history-use-case'
import { CustomerGetOrderDetailsUseCase } from '../domain/interfaces/use-cases/customer/get-order-details-use-case'

export default function OrderRouter(
    getOrderHistory: CustomerGetOrderHistoryUseCase,
    getOrderDetails: CustomerGetOrderDetailsUseCase
) {
    const router = express.Router()

    // Get Order History
    router.get('/', [ 
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Customer),
        async (req: Request, res: Response) => {
            try 
            {
                const params = {
                    customer_id: req.body.unique_num
                }
    
                const validationResult = getOrderHistory.validate(params)
    
                if (validationResult.isValid)
                {
                    const result = await getOrderHistory.execute(params)

                    if (result)
                    {
                        return res.status(200).send(result)
                    }
                    else
                    {
                        return res.status(400).send({ message: "Unable to retrieve the order history." })
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
                return res.status(500).send()
            }
        } ])
    
    // Get Order Details
    router.get('/:order_id', [ 
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Customer),
        async (req: Request, res: Response) => {
            try 
            {
                const params = {
                    customer_id: req.body.unique_num!,
                    order_id: Number(req.params.order_id!)
                }
    
                const validationResult = getOrderDetails.validate(params)
    
                if (validationResult.isValid)
                {
                    const result = await getOrderDetails.execute(params)

                    if (result)
                    {
                        return res.status(200).send(result)
                    }
                    else
                    {
                        return res.status(400).send({ message: "Unable to retrieve the details of the requested order." })
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
                return res.status(500).send()
            }
        } ])

    return router
}