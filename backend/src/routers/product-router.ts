import moment from 'moment'
import express from 'express'
import { Request, Response } from 'express'
import * as Auth from '../middleware/auth.validation.middleware'
import { minimumPermissionLevelRequired, Role } from '../middleware/auth.permission.middleware'
import { AddProductUseCase } from '../domain/interfaces/use-cases/vendor/add-product-use-case'
import { UpdateProductUseCase } from '../domain/interfaces/use-cases/vendor/update-product-use-case'
import { DeleteProductUseCase } from '../domain/interfaces/use-cases/vendor/delete-product-use-case'
import { GetProductsUseCase } from '../domain/interfaces/use-cases/vendor/get-products-use-case'
import { GetProductDetailsUseCase } from '../domain/interfaces/use-cases/vendor/get-product-details-use-case'
import * as util from '../utils/util'

export default function ProductRouter(
    addProduct: AddProductUseCase,
    updateProduct: UpdateProductUseCase,
    deleteProduct: DeleteProductUseCase,
    getProductList: GetProductsUseCase,
    getProductDetails: GetProductDetailsUseCase
) {
    const router = express.Router()

    // Get All Products
    router.get('/', [ 
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Vendor),
        async (req: Request, res: Response) => {
            try 
            {
                const params = {
                    vendor_id: req.body.unique_num
                }
    
                const validationResult = getProductList.validate(params)
    
                if (validationResult.isValid)
                {
                    const result = await getProductList.execute(params)

                    if (result)
                    {
                        return res.status(result.statusCode!).send(result)
                    }
                    else
                    {
                        return res.status(400).send({ message: "Unable to retrieve the list of products for the store." })
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
    
    // Get Product Details
    router.get('/:product_id', [ 
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Vendor),
        async (req: Request, res: Response) => {
            try 
            {
                const params = {
                    vendor_id: req.body.unique_num,
                    product_sku: req.params.product_id,
                    filter_params: undefined
                }
    
                const validationResult = getProductDetails.validate(params)
    
                if (validationResult.isValid)
                {
                    const result = await getProductDetails.execute(params)

                    if (result)
                    {
                        return res.status(result.statusCode!).send(result)
                    }
                    else
                    {
                        return res.status(400).send({ message: "Unable to search for the product you are looking for." })
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

    // Add New Product
    router.post('/', [ 
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Vendor),
        async (req: Request, res: Response) => {
            try 
            {
                const params = {
                    vendor_id: req.body.unique_num,
                    category: util.sanitize(req.body.category),
                    product_name: util.sanitize(req.body.product_name),
                    product_price: req.body.product_price,
                    product_image: req.body.product_image,
                    product_stock: req.body.product_stock,
                    product_sku: req.body.product_sku,
                    stock_amt: req.body.stock_amount
                }
    
                const validationResult = addProduct.validate(params)
    
                if (validationResult.isValid)
                {
                    const result = await addProduct.execute(params)

                    if (result)
                    {
                        return res.status(result.statusCode!).send(result)
                    }
                    else
                    {
                        return res.status(400).send({ message: "Unable to process adding of new products" })
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

    // Update Product Details
    router.put('/:product_id', [ 
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Vendor),
        async (req: Request, res: Response) => {
            try 
            {
                const params = {
                    updated_at: req.body.updated_at,
                    vendor_id: req.body.unique_num,
                    category: util.sanitize(req.body.category),
                    product_id: undefined,
                    product_name: util.sanitize(req.body.product_name),
                    product_price: req.body.product_price,
                    product_image: req.body.product_image,
                    product_stock: req.body.product_stock,
                    product_sku: req.params.product_id,
                    stock_amt: req.body.product_stock
                }
    
                const validationResult = updateProduct.validate(params)
    
                if (validationResult.isValid)
                {
                    const result = await updateProduct.execute(params)

                    if (result)
                    {
                        return res.status(result.statusCode!).send(result)
                    }
                }
                else
                {
                    console.log(validationResult);
                    return res.status(400).send({ message: validationResult.message })
                }
            }
            catch (err)
            {
                console.log(err)
                return res.status(500).send()
            }
        } ])

    // Delete Product
    router.delete('/:product_id', [ 
        Auth.validJWTNeeded,
        minimumPermissionLevelRequired(Role.Vendor),
        async (req: Request, res: Response) => {
            try 
            {
                const params = {
                    updated_at: req.body.updated_at,
                    vendor_id: req.body.unique_num,
                    product_id: undefined,
                    product_sku: req.params.product_id
                }
    
                const validationResult = deleteProduct.validate(params)
    
                if (validationResult.isValid)
                {
                    const result = await deleteProduct.execute(params)

                    if (result)
                    {
                        return res.status(result.statusCode!).send(result)
                    }
                }
                else
                {
                    return res.status(400).send()
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