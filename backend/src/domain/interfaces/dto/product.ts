export interface ProductDto {
    statusCode: number|undefined;
    message: string|undefined;
    category: string|undefined;
    product_id: string|undefined; // Product SKU
    product_name: string|undefined;
    product_price: string|undefined;
    product_image: string|undefined;
}

export interface ProductListDto {
    statusCode: number|undefined;
    message: string|undefined;
    total_pages: number|undefined;
    result: any|undefined;
}

export interface GetProductDetailReqDto {
    product_id: string|undefined;
    filter_params: any|undefined;
}

export interface GetCatalogReqDto {
    category: string|undefined;
    filter_params: any|undefined;
    current_page: number|undefined;
    display_count: number|undefined;
}

export interface GetVendorProductListReqDto {
    vendor_id: number|undefined;
}

export interface GetVendorProductListResDto {
    statusCode: number|undefined;
    message: string|undefined;
    result: any|undefined;
}

export interface GetVendorProductDetailsReqDto {
    vendor_id: number|undefined;
    product_sku: string|undefined;
    filter_params: string|undefined;
}

export interface GetVendorProductDetailsResDto {
    statusCode: number|undefined;
    message: string|undefined;
    product_id: string|undefined; // Product SKU
    product_name: string|undefined;
    product_price: string|undefined;
    product_image: string|undefined;
    product_stock: number|undefined;
    category: string|undefined;
    updated_at: number|undefined;
}

export interface AddProductReqDto {
    vendor_id: number|undefined;
    category: string|undefined;
    product_name: string|undefined;
    product_price: number|undefined;
    product_image: string|undefined;
    product_sku: string|undefined;
    product_stock: number|undefined;
}

export interface UpdateProductReqDto {
    updated_at: number|undefined;
    vendor_id: number|undefined;
    category: string|undefined;
    product_id: number|undefined;
    product_name: string|undefined;
    product_stock: string|undefined;
    product_price: number|undefined;
    product_image: string|undefined;
    product_sku: string|undefined;
    stock_amt: number|undefined;
}

export interface DeleteProductReqDto {
    updated_at: number|undefined;
    vendor_id: number|undefined;
    product_id: number|undefined;
    product_sku: string|undefined;
}

export interface UpdateProductStockReqDto {
    vendor_id: number|undefined;
    product_sku: string|undefined;
    stock: number|undefined;
}

export interface AddProductResDto {
    statusCode: number|undefined;
    message: string|undefined;
}
export interface UpdateProductResDto {
    statusCode: number|undefined;
    message: string|undefined;
}
export interface DeleteProductResDto {
    statusCode: number|undefined;
    message: string|undefined;
}
export interface UpdateProductStockResDto {
    statusCode: number|undefined;
    message: string|undefined;
}