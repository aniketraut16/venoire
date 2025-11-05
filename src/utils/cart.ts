import { AddToCartArgs, CartItem } from "@/types/cart";
import axios from "axios";
import { cookies } from "next/headers";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const addToCart = async (
  args: AddToCartArgs,
  token: string | null = null
): Promise<boolean> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = (await cookies()).get("sessionId")?.value;
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        (await cookies()).set("sessionId", sessionId, {
          maxAge: 60 * 60 * 24 * 30,
        });
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
      ? { headers: { "x-session-id": sessionId } }
      : {};
    await axios.post(`${baseUrl}/cart/items`, args, headers);
    return true;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return false;
  }
};

export const getCart = async (
  token: string | null = null
): Promise<CartItem[]> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = (await cookies()).get("sessionId")?.value;
      if (!sessionId) {
        return [];
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
      ? { headers: { "x-session-id": sessionId } }
      : {};
    const response = await axios.get(`${baseUrl}/cart`, headers);
    return response.data.data as CartItem[];
  } catch (error) {
    console.error("Error getting cart:", error);
    return [];
  }
};

export const removeFromCart = async (
  itemId: string,
  token: string | null = null
): Promise<boolean> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = (await cookies()).get("sessionId")?.value;
      if (!sessionId) {
        return false;
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
      ? { headers: { "x-session-id": sessionId } }
      : {};
    await axios.delete(`${baseUrl}/cart/${itemId}`, headers);
    return true;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return false;
  }
};

export const updateCartItem = async (
  itemId: string,
  args: AddToCartArgs,
  token: string | null = null
): Promise<boolean> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = (await cookies()).get("sessionId")?.value;
      if (!sessionId) {
        return false;
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
      ? { headers: { "x-session-id": sessionId } }
      : {};
    await axios.put(`${baseUrl}/cart/${itemId}`, args, headers);
    return true;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return false;
  }
};

export const mergeCartAfterLogin = async (token: string): Promise<void> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = (await cookies()).get("sessionId")?.value;
      if (!sessionId) {
        return;
      }
    }
    await axios.patch(`${baseUrl}/cart`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionId,
      },
    });
    return;
  } catch (error) {
    console.error("Error merging cart after login:", error);
    return;
  }
};
