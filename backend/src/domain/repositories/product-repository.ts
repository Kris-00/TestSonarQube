import { PrismaClient, Prisma } from '@prisma/client'
import moment from 'moment'
import * as DTO from '../interfaces/dto/product'
import { ProductRepository } from '../interfaces/repositories/product-repository'

export class ProductRepositoryImpl implements ProductRepository {
    _db: PrismaClient
    constructor(prisma: PrismaClient){
        this._db = prisma
    }

    async getCatalogProducts(params: DTO.GetCatalogReqDto): Promise<any> {
        const result = await this._db.product_Stock.findMany({
            where: {
                isDeleted: false,
                OR: [
                    {
                        product: {
                            product_name: {
                                contains: params.filter_params,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        product: {
                            category_name: {
                                contains: params.filter_params,
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            },
            skip: ((params.current_page!-1) * params.display_count!),
            take: params.display_count!,
            include: { product: true }
        })

        return result
    }

    async getCatalogProductDetail(params: DTO.GetProductDetailReqDto): Promise<any> {
        const result = await this._db.product_Stock.findFirst({
            where: { productSku: params.product_id!, isDeleted: false },
            include: { product: true }
        })

        return result
    }

    async getProductList(storeDetails: DTO.GetVendorProductListReqDto): Promise<any> {
        const result = await this._db.product.findMany({
            where: { vendorId: storeDetails.vendor_id, isDeleted: false },
            include: { productStock: true }
        })

        return result
    }

    async getProduct(productDetails: DTO.GetVendorProductDetailsReqDto): Promise<any> {
        const result = await this._db.product_Stock.findFirst({
            where: {
                productSku: productDetails.product_sku,
                product: {
                    vendorId: productDetails.vendor_id!
                },
                isDeleted: false
            },
            include: {
                product: true
            }
        })

        return result
    }

    async getProductByName(productDetails: DTO.GetVendorProductDetailsReqDto): Promise<any> {
        const result = await this._db.product_Stock.findFirst({
            where: {
                product: {
                    vendorId: productDetails.vendor_id!,
                    product_name: {
                        equals: productDetails.filter_params,
                        mode: 'insensitive'
                    }
                },
                isDeleted: false
            },
            include: {
                product: true
            }
        })

        return result
    }

    async addProduct(productDetails: DTO.AddProductReqDto): Promise<any> {
        const result = await this._db.product.create({
            data: {
                category_name: productDetails.category!,
                product_name: productDetails.product_name!,
                product_image: productDetails.product_image!,
                product_price: productDetails.product_price!,
                vendorId: productDetails.vendor_id!,
                updatedAt: moment().toISOString(),
                productStock: {
                    create: [
                        { 
                            productSku: productDetails.product_sku!,
                            updatedAt: moment().toISOString(),
                            sku_price: productDetails.product_price!, 
                            stock_amt: productDetails.product_stock! 
                        }
                    ]
                }
            }
        })

        return result
    }
    
    async updateProduct(productDetails: DTO.UpdateProductReqDto): Promise<any> {
        const result = await this._db.product.update({
            where: {
                productId: productDetails.product_id
            },
            data: {
                category_name: productDetails.category!,
                product_name: productDetails.product_name!,
                product_image: productDetails.product_image!,
                product_price: productDetails.product_price!,
                vendorId: productDetails.vendor_id!,
                updatedAt: moment().toISOString(),
                productStock: {
                    update: {  
                        where: { productSku: productDetails.product_sku! },
                        data: {
                            sku_price: productDetails.product_price!, 
                            stock_amt: productDetails.stock_amt!,
                            updatedAt: moment().toISOString(), 
                        }
                    }
                }
            }
        })

        return result
    }

    async deleteProduct(productDetails: DTO.DeleteProductReqDto): Promise<any> {
        const result = await this._db.product_Stock.update({
            where: { productSku: productDetails.product_sku! },
            data: {
                isDeleted: true,
                updatedAt: moment().toISOString(),
                deletedAt: moment().toISOString()
            }
        })

        return result
    }
    
    async updateProductStock(productDetails: DTO.UpdateProductStockReqDto): Promise<any> {
        const result = await this._db.product_Stock.update({
            where: { productSku: productDetails.product_sku! },
            data: {
                stock_amt: productDetails.stock!
            }
        })
    }
}