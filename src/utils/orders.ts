import {
  CancelOrderArgs,
  CancelOrderResponse,
  DetailedOrder,
  IntiateOrderArgs,
  MOCK_ORDER_CALLBACK_Args,
  Order,
  TrackOrderResponse,
  GetOrderReviewsResponse,
  CreateReviewArgs,
  CreateReviewResponse,
} from "@/types/orders";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const intiateOrder = async (
  args: IntiateOrderArgs,
  token: string
): Promise<{
  success: boolean;
  message: string;
  orderId: string;
}> => {
  try {
    const response = await axios.post(`${baseUrl}/orders/initiate`, args, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: true,
      message: "Order intiated successfully",
      orderId: response.data.data.orderId,
    };
  } catch (error) {
    console.error("Error intiating order:", error);
    return {
      success: false,
      message: (error as any)?.response?.data?.error as string,
      orderId: "",
    };
  }
};

export const MOCK_ORDER_CALLBACK = async (
  args: MOCK_ORDER_CALLBACK_Args
): Promise<boolean> => {
  try {
    await axios.post(`${baseUrl}/orders/complete`, args);
    return true;
  } catch (error) {
    console.error("Error calling mock order callback:", error);
    return false;
  }
};

export const getOrders = async (
  token: string,
  params?: {
    page?: number;
    limit?: number;
    status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
    sort?: "created_at" | "updated_at" | "total_amount" | "order_number";
    order?: "asc" | "desc";
    search?: string;
    date_from?: string;
    date_to?: string;
  }
): Promise<{ success: boolean; data: Order[];
  pagination: {
    current_page: number,
    total_pages: number,
    total_orders: number,
    per_page: number,
    has_next: boolean,
    has_prev: boolean
}
 }> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.sort) queryParams.append("sort", params.sort);
    if (params?.order) queryParams.append("order", params.order);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.date_from) queryParams.append("date_from", params.date_from);
    if (params?.date_to) queryParams.append("date_to", params.date_to);
    
    const queryString = queryParams.toString();
    const url = `${baseUrl}/user/orders${queryString ? `?${queryString}` : ""}`;
    
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data.data.orders as Order[] ,pagination: response.data.data.pagination };
  } catch (error) {
    console.error("Error getting orders:", error);
    return { success: false, data: [] as Order[] ,pagination: { current_page: 1, total_pages: 1, total_orders: 0, per_page: 10, has_next: false, has_prev: false } };
  }
};

export const getOrder = async (
  orderId: string,
  token: string
): Promise<{ success: boolean; data: DetailedOrder | null }> => {
  try {
    const response = await axios.get(`${baseUrl}/user/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as {
      success: boolean;
      data: DetailedOrder | null;
    };
  } catch (error) {
    console.error("Error getting order:", error);
    return { success: false, data: null };
  }
};
export const cancelOrder = async (orderId: string, token: string, args: CancelOrderArgs): Promise<CancelOrderResponse> => {
  try {
    const response = await axios.post(`${baseUrl}/user/orders/${orderId}/cancel`, args, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as CancelOrderResponse;
  } catch (error) {
    console.error("Error cancelling order:", error);
    return { success: false, message: "Failed to cancel order", data: null };
  }
};
export const trackOrder = async (orderId: string, token: string): Promise<{ success: boolean; data: TrackOrderResponse | null }> => {
  try {
    const response = await axios.get(`${baseUrl}/user/orders/${orderId}/track`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as {
      success: boolean;
      data: TrackOrderResponse | null;
    };
  } catch (error) {
    console.error("Error tracking order:", error);
    return { success: false, data: null };
  }
};

export const getOrderReviews = async (
  orderId: string,
  token: string
): Promise<GetOrderReviewsResponse> => {
  try {
    const response = await axios.get(`${baseUrl}/user/orders/${orderId}/reviews`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as GetOrderReviewsResponse;
  } catch (error) {
    console.error("Error getting order reviews:", error);
    return {
      success: false,
      data: {
        order_id: orderId,
        reviews: [],
        can_review: false,
      },
    };
  }
};

export const createOrderReview = async (
  orderId: string,
  token: string,
  reviewData: CreateReviewArgs
): Promise<CreateReviewResponse> => {
  try {
    const response = await axios.post(
      `${baseUrl}/user/orders/${orderId}/reviews`,
      reviewData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data as CreateReviewResponse;
  } catch (error: any) {
    console.error("Error creating review:", error);
    return {
      success: false,
      message: error?.response?.data?.error?.message || "Failed to submit review",
      data: {
        review_id: "",
        product_id: reviewData.product_id,
        product_name: "",
        rating: reviewData.rating,
        comment: reviewData.comment || null,
        is_approved: false,
        created_at: new Date().toISOString(),
      },
    };
  }
};