export interface AddToCartReqDto {
    customer_id: number|undefined;
    account_id: string|undefined;
    cart_id: number|undefined;
    cart_product_id: number|undefined;
    product_sku: string|undefined;
    qty: number|undefined;
    product_price: number|undefined;
    new_stock_amt: number|undefined;
}

export interface AddtoCartResDto {
    statusCode: number|undefined;
    message: string|undefined;
}

export interface RemoveFromCartReqDto {
    customer_id: number|undefined;
    account_id: string|undefined;
    cart_id: number|undefined;
    product_sku: string|undefined;
    new_stock_amt: number|undefined;
    product_price: number|undefined;
}

export interface RemoveFromCartResDto {
    statusCode: number|undefined;
    message: string|undefined;
}

export interface UpdateCartItemReqDto {
    customer_id: number|undefined;
    account_id: string|undefined;
    cart_id: number|undefined;
    product_sku: string|undefined;
    qty: number|undefined;
    cart_product_id: number|undefined;
    product_price: number|undefined;
    new_stock_amt: number|undefined;
}

export interface UpdateCartItemResDto {
    statusCode: number|undefined;
    message: string|undefined;
}

export interface CheckoutReqDto {
    customer_id: number|undefined;
    account_id: string|undefined;
}

export interface CheckoutResDto {
    statusCode: number|undefined;
    message: string|undefined;
}

export interface LeaveReviewReqDto {
    order_id: number|undefined;
    product_sku: string|undefined;
    review: string|undefined;
}

export interface LeaveReviewResDto {
    statusCode: number|undefined;
    message: string|undefined;
}

export interface GetOrderReqDto {
    order_id: number|undefined;
    customer_id: number|undefined;
}

export interface GetOrderResDto {
    statusCode: number|undefined;
    message: string|undefined;
    payment_date: string|undefined;
    order_total: string|undefined;
    order_items: any|undefined;
}

export interface GetOrderHistoryReqDto {
    customer_id: number|undefined;
}

export interface GetOrderHistoryResDto {
    statusCode: number|undefined;
    message: string|undefined;
    result: any|undefined;
}

export interface GetStoreOrdersReqDto {
    vendor_id: number|undefined;
}

export interface GetStoreOrdersResDto {}

export interface GetStoreOrderDetailsReqDto {
    order_id: number|undefined;
    vendor_id: number|undefined;
}

export interface GetStoreOrderDetailsResDto {}

export interface order_item {
    productSku: string;
    vendorId: number;
    item_qty: number;
    item_price: number;
}

export interface AddOrderReqDto {
    cart_id: number|undefined;
    customer_id: number|undefined;
    order_total: number|undefined;
    order_items: Array<order_item>;
}

export interface AddOrderResDto {}

export interface UpdateOrderReqDto {}

export interface UpdateOrderResDto {}

export interface DeleteOrderReqDto {}

export interface DeleteOrderResDto {}

export interface GetCartItemsReqDto {
    customer_id: number|undefined;
    account_id: string|undefined;
}

export interface GetCartItemsResDto {
    statusCode: number|undefined;
    message: string|undefined;
    result: any|undefined;
}