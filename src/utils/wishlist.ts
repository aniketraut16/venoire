import { Product } from "@/types/product";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getWishlist = async (token: string): Promise<Product[]> => {
    try {
        const response = await axios.get(`${baseUrl}/user/wishlist`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data.data as Product[];
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
}

export const addOrRemoveFromWishlist = async (token: string, productId: string, action: "add" | "remove"): Promise<{ success: boolean, message: string }> => {
    try {
        const response = await axios.post(
            `${baseUrl}/user/wishlist/${productId}?action=${action}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data as { success: boolean, message: string };
    } catch (error: any) {
        console.error("Error adding to wishlist:", error);
        return { success: false, message: error.message as string | "Failed to add or remove from wishlist" };
    }
}