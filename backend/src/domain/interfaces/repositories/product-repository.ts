import * as DTO from "../dto/product";

export interface ProductRepository {
    getCatalogProducts(params: DTO.GetCatalogReqDto): Promise<any|null>;
    getCatalogProductDetail(params: DTO.GetProductDetailReqDto): Promise<any|null>;

    getProductList(storeDetails: DTO.GetVendorProductListReqDto): Promise<any|null>;
    getProduct(productDetails: DTO.GetVendorProductDetailsReqDto): Promise<any|null>;
    getProductByName(productDetails: DTO.GetVendorProductDetailsReqDto): Promise<any>;
    addProduct(productDetails: DTO.AddProductReqDto): Promise<any|null>;
    updateProduct(productDetails: DTO.UpdateProductReqDto): Promise<any|null>;
    deleteProduct(productDetails: DTO.DeleteProductReqDto): Promise<any|null>;
    updateProductStock(productDetails: DTO.UpdateProductStockReqDto): Promise<any|null>;
}