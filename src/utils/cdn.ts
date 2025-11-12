import { CdnResponse } from "@/types/cdn";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getCdn = async (
    type: "categories" | "collections" | "tags" | "products" | "perfumes"
): Promise<CdnResponse> => {
  try {
    const response = await axios.get(`${baseUrl}/cdn?type=${type}`);
    return response.data as CdnResponse;
  } catch (error) {
    console.error("Error fetching CDN:", error);
    return {
      success: false,
      message: "Failed to fetch CDN",
      data: { categories: [], collections: [], tags: [], products: [], perfumes: [] },
    };
  }
};
