export type Product = {
  id: string;
  slug: string;

  name: string;
  category: string;
  catalog: string;

  price: number;
  originalPrice: number;
  discount: number;
  size: string[];
  thumbnail: string;
  mode?: "light" | "dark";
};


export interface ProductPricing {
  price: number;
  originalPrice: number;
  discount: number;
  itemsRemaining: number;
  size: string | null;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface DetailProduct {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  tags: string[];
  pricing: ProductPricing[];
  thumbnail: string | null;
  images: string[];
  description: string | null;
  attributes: ProductAttribute[];
}

export interface DetailProductResponse {
  success: boolean;
  message: string;
  data: DetailProduct | null;
  error: string;
}


export interface ProductFilters {
  search?: string;
  category_id?: string;
  category_slug?: string;
  collection_id?: string;
  collection_slug?: string;
  tag_id?: string;
  tag_slug?: string;
  product_type?: "clothing" | "perfume";
  min_price?: number;
  max_price?: number;
  rating?: number;
  attributes?: string; // comma-separated IDs
  sort_by?: "created_at" | "updated_at" | "name" | "price" | "rating" | "rating_count";
  sort_order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  success: boolean;
  data?: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  headers?: {
    title: string;
    description: string;
  };
  filters?: ProductFilters & { attributes?: string[] };
  message?: string;
  error?: string;
}

export interface AttributeValue {
  id: string;
  value: string;
  display_value: string;
  sort_order: number;
  product_count: number;
}

export interface Attribute {
  id: string;
  display_name: string;
  sort_order: number;
  total_product_count: number;
  values: AttributeValue[];
}

export interface AttributesResponse {
  success: boolean;
  data?: Attribute[];
  meta?: {
    total_attributes: number;
    total_values: number;
  };
  message?: string;
  error?: string;
}