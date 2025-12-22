import { Perfume, DetailedPerfume, PerfumeCollection } from "@/types/perfume";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getPerfumes = async (
  params?: {
    search?: string;
    collection_slug?: string;
  }
): Promise<Perfume[]> => {  
    try {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("search", params.search);
        if (params?.collection_slug) queryParams.append("collection_slug", params.collection_slug);
        const queryString = queryParams.toString();
        const response = await axios.get(`${baseUrl}/product/all-perfumes?${queryString}`);
        return response.data.data as Perfume[];
    } catch (error) {
        console.error("Error fetching perfumes:", error);
        return [];
    }
}

export const getSimilarPerfumes = async (id: string): Promise<Perfume[]> => {
    try {
        const response = await axios.get(`${baseUrl}/product/similar-perfumes/${id}`);
        return response.data.data as Perfume[];
    } catch (error) {
        console.error("Error fetching similar perfumes:", error);
        return [];
    }
}

export const getDetailedPerfume = async (slug: string): Promise<DetailedPerfume | null> => {
    try {
        const response = await axios.get(`${baseUrl}/product/all-perfumes/${slug}`);
        return response.data.data as DetailedPerfume;
    } catch (error) {
        console.error("Error fetching detailed perfume:", error);
        return null;
    }
}

export const getPerfumeCollections = async (): Promise<PerfumeCollection[]> => {
    try {
        const response = await axios.get(`${baseUrl}/product/perfume-collections`);
        return response.data.data as PerfumeCollection[];
    } catch (error) {
        console.error("Error fetching perfume collections:", error);
        return [];
    }
}