import axios from "axios";
import { 
  CategoryorCollection, 
  HomepageContentResponse 
} from "@/types/homepage";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getHomepageContent = async (): Promise<HomepageContentResponse> => {
  try {
    const response = await axios.get(`${baseUrl}/home/content`);
    return response.data as HomepageContentResponse;
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    return {
      success: false,
      message: "Failed to fetch homepage content",
      error: error instanceof Error ? error.message : "Unknown error",
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

