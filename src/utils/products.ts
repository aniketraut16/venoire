import { AttributesResponse,  DetailProductResponse, ProductFilters, ProductsResponse } from "@/types/product";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getProducts = async (filters: ProductFilters): Promise<ProductsResponse> => {
  try {
    const response = await axios.get(`${baseUrl}/product/all`, { params: filters });
    return response.data as ProductsResponse;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, data: [], pagination: { page: 1, limit: 5, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
  }
};

export const getAttributes = async (): Promise<AttributesResponse> => {
  try {
    const response = await axios.get(`${baseUrl}/product/attributes-list`);
    return response.data as AttributesResponse;
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return { success: false, data: [] };
  }
};  


export const getDetailProduct = async (slug: string): Promise<DetailProductResponse> => {
  try {
    const response = await axios.get(`${baseUrl}/product/get-product-details/${slug}`);
    return response.data as DetailProductResponse;
  } catch (error) {
    console.error("Error fetching detail product:", error);
    return { success: false, data: null, message: "Error fetching detail product", error: "Error fetching detail product" };
  }
};
