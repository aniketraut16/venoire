import axios from "axios";
import { CategoryorCollection, NavbarContentResponse, TopProductswithCategory } from "@/types/homepage";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getNavbarContent = async (): Promise<NavbarContentResponse> => {
  try {
    const response = await axios.get(`${baseUrl}/home/navbar`);
    return response.data as NavbarContentResponse;
  } catch (error) {
    console.error("Error fetching navbar content:", error);
    return {
      success: false,
      message: "Failed to fetch navbar content",
      error: error as string,
    };  
  }
};

export const getCategories = async (): Promise<{
    collections: CategoryorCollection[],
    categories: CategoryorCollection[]
}> => {
  try {
    const response = await axios.get(`${baseUrl}/home/collections-and-categories`);
    return response.data.data as {
        collections: CategoryorCollection[],
        categories: CategoryorCollection[]
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
        collections: [],
        categories: []
    };
  }
};

export const getTopProducts = async (): Promise<TopProductswithCategory[]> => {
  try {
    const response = await axios.get(`${baseUrl}/home/top-products`);
    return response.data.data as TopProductswithCategory[];
  } catch (error) {
    console.error("Error fetching top products:", error);
    return [];
  }
};
