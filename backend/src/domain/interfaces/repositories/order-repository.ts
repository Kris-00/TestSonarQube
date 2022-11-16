import * as DTO from '../dto/order'

export interface OrderRepository {
    getOrders(params: DTO.GetOrderHistoryReqDto): Promise<any | null>;
    getOrderDetails(params: DTO.GetOrderReqDto): Promise<any | null>;
    getStoreOrders(params: DTO.GetStoreOrdersReqDto): Promise<any | null>;
    getStoreOrderDetails(params: DTO.GetStoreOrderDetailsReqDto): Promise<any | null>;

    getCartItems(params: DTO.GetCartItemsReqDto): Promise<any|null>;
    addToCart(params: DTO.AddToCartReqDto): Promise<any | null>;
    removeFromCart(params: DTO.RemoveFromCartReqDto): Promise<any | null>;
    leaveReview(params: DTO.LeaveReviewReqDto): Promise<any | null>;
    addOrder(params: DTO.AddOrderReqDto): Promise<any | null>;
    updateOrder(params: DTO.UpdateOrderReqDto): Promise<any | null>;
    deleteOrder(params: DTO.DeleteOrderReqDto): Promise<any | null>;
}