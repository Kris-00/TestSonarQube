import moment from 'moment'
import express from 'express'
import { Request, Response } from 'express'
import * as Auth from '../middleware/auth.validation.middleware'
import { minimumPermissionLevelRequired, Role } from '../middleware/auth.permission.middleware'
import { CustomerGetCatalogProductsUseCase } from '../domain/interfaces/use-cases/customer/get-catalog-products-use-case'
import { CustomerGetCatalogProductDetailUseCase } from '../domain/interfaces/use-cases/customer/get-catalog-product-details-use-case'
import * as util from '../utils/util'
import { GetCatalogReqDto, GetProductDetailReqDto } from '../domain/interfaces/dto/product'

export default function CatalogRouter(
    getCatalogProducts: CustomerGetCatalogProductsUseCase,
    getCatalogProductDetails: CustomerGetCatalogProductDetailUseCase
) {
    const router = express.Router()

    // Get List of Product for a particular catalog
    router.get('/', async (req: Request, res: Response) => {
        try
        {
            const params: GetCatalogReqDto = {
                category: req.body.category,
                filter_params: req.query.keyword,
                current_page: (!req.body.current_page) ? 1 : req.body.current_page,
                display_count: (!req.body.display_count) ? 10 : req.body.display_count
            }

            const validationResult = await getCatalogProducts.validate(params)
            
            if (validationResult.isValid)
            {
                const result = await getCatalogProducts.execute(params)

                if (result)
                {
                    return res.status(result.statusCode!).send(result)
                }
                else
                {
                    return res.status(200).send({ result: [] })
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
            res.status(500).send()
        }
    })

    router.get('/:product_id', async (req: Request, res: Response) => {
        try
        {
            const params: GetProductDetailReqDto = {
                product_id: req.params.product_id,
                filter_params: undefined
            }

            const validationResult = await getCatalogProductDetails.validate(params)

            if (validationResult.isValid)
            {
                const result = await getCatalogProductDetails.execute(params)

                if (result)
                {
                    return res.status(result.statusCode!).send(result)
                }
                else
                {
                    return res.status(400).send()
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
    })

    return router;
}