import { IntiateOrderArgs, MOCK_ORDER_CALLBACK_Args } from "@/types/orders";
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
      message: "Failed to intiate order",
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
