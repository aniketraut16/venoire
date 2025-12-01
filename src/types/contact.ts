export interface InquiryData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    created_at: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface NewsletterData {
  email: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    subscribed_at: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

