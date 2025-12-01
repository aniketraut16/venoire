import axios from "axios";
import {
  InquiryData,
  InquiryResponse,
  NewsletterData,
  NewsletterResponse,
} from "@/types/contact";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const submitInquiry = async (
  data: InquiryData,
  token?: string
): Promise<InquiryResponse> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(
      `${baseUrl}/contact/inquiry`,
      data,
      { headers }
    );

    return response.data as InquiryResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as InquiryResponse;
    }
    
    console.error("Error submitting inquiry:", error);
    return {
      success: false,
      message: "Failed to submit inquiry. Please try again.",
    };
  }
};

export const subscribeNewsletter = async (
  data: NewsletterData,
  token?: string
): Promise<NewsletterResponse> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(
      `${baseUrl}/contact/newsletter`,
      data,
      { headers }
    );

    return response.data as NewsletterResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as NewsletterResponse;
    }
    
    console.error("Error subscribing to newsletter:", error);
    return {
      success: false,
      message: "Failed to subscribe. Please try again.",
    };
  }
};
