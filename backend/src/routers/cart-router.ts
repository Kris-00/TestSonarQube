import moment from 'moment'
import express from 'express'
import { Request, Response } from 'express'
import * as Auth from '../middleware/auth.validation.middleware'
import { minimumPermissionLevelRequired, Role } from '../middleware/auth.permission.middleware'
import * as util from '../utils/util'
import { AddToCartUseCase } from '../domain/interfaces/use-cases/customer/add-to-cart-use-case'
import { RemoveFromCartUseCase } from '../domain/interfaces/use-cases/customer/remove-from-cart-use-case'
import { UpdateCartItemUseCase } from '../domain/interfaces/use-cases/customer/update-cart-item-use-case'
import { GetCartItemsUseCase } from '../domain/interfaces/use-cases/customer/get-cart-items-use-case'
import { CheckoutUseCase } from '../domain/interfaces/use-cases/customer/checkout-use-case'

export default function CartRouter(
    getCartItems: GetCartItemsUseCase,
    addToCart: AddToCartUseCase,
    updateCartItem: UpdateCartItemUseCase,
    removeFromCart: RemoveFromCartUseCase,
    checkoutCart: CheckoutUseCase
) {
    const router = express.Router()

    // Get Cart
    router.get('/', [
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Customer),
        async (req: Request, res: Response) =>{
            try
            {
                const params = {
                    customer_id: req.body.unique_num,
                    account_id: req.body.userid
                }

                const validationResult = getCartItems.validate(params)

                if (validationResult.isValid)
                {
                    const result = await getCartItems.execute(params)

                    if (result)
                    {
                        return res.status(result.statusCode!).send(result)
                    }
                    else 
                    {
                        return res.status(400).send({ message: "Invalid request." })
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
        }
    ])

    router.get('/:product_id', [
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Customer),
        async (req: Request, res: Response) =>{
            return res.status(404).send()
        }
    ])

    // Add To Cart
    router.post('/', [
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Customer),
        async (req: Request, res: Response) =>{
            try
            {
                const params = {
                    customer_id: req.body.unique_num,
                    account_id: req.body.userid,
                    cart_id: req.body.cart_id,
                    product_sku: util.sanitize(req.body.product_id),
                    qty: req.body.qty,
                    cart_product_id: undefined,
                    product_price: undefined,
                    new_stock_amt: undefined
                }
                
                const validationResult = addToCart.validate(params)

                if (validationResult.isValid)
                {
                    const result = await addToCart.execute(params)

                    if (result)
                    {
                        return res.status(result.statusCode!).send(result)
                    }
                    else 
                    {
                        return res.status(400).send({ message: "Invalid request." })
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
        }
    ])

    // Update Qty
    router.put('/', [
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Customer),
        async (req: Request, res: Response) =>{
            try
            {
                const params = {
                    customer_id: req.body.unique_num,
                    account_id: req.body.userid,
                    cart_id: req.body.cart_id,
                    product_sku: util.sanitize(req.body.product_id),
                    qty: req.body.qty,
                    cart_product_id: undefined,
                    product_price: undefined,
                    new_stock_amt: undefined
                }
                
                const validationResult = updateCartItem.validate(params)

                if (validationResult.isValid)
                {
                    const result = await updateCartItem.execute(params)

                    if (result)
                    {
                        return res.status(result.statusCode!).send(result)
                    }
                    else 
                    {
                        return res.status(400).send({ message: "Invalid request." })
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
        }
    ])

    // Delete Qty
    router.delete('/', [
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Customer),
        async (req: Request, res: Response) =>{
            try
            {
                const params = {
                    customer_id: req.body.unique_num,
                    account_id: req.body.userid,
                    cart_id: req.body.cart_id,
                    product_sku: util.sanitize(req.body.product_id),
                    product_price: undefined,
                    new_stock_amt: undefined
                }
                
                const validationResult = removeFromCart.validate(params)

                if (validationResult.isValid)
                {
                    const result = await removeFromCart.execute(params)

                    if (result)
                    {
                        return res.status(result.statusCode!).send(result)
                    }
                    else 
                    {
                        return res.status(400).send({ message: "Invalid request." })
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
        }
    ])

    // Checkout
    router.post('/checkout', [
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Customer),
        async (req: Request, res: Response) =>{
            try
            {
                const params = {
                    customer_id: req.body.unique_num,
                    account_id: req.body.userid,
                }

                const validationResult = checkoutCart.validate(params)

                if (validationResult.isValid)
                {
                    const result = await checkoutCart.execute(params)

                    if (result)
                    {
                        return res.status(result.statusCode!).send(result)
                    }
                    else 
                    {
                        return res.status(400).send({ message: "Invalid request." })
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
        }
    ])

    return router
}