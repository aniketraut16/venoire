export type Perfume = {
    id: string;
    name: string;
    slug: string;
    description: string;
    images: string[];
    fragrance: string;
    concentration: string;
    base_notes: string;
    rating: string;
    rating_count: number;
    coverImage: string;
    gender: "Mens" | "Womens" | "Unisex";
    price: {
        id: string;
        quantity: number;
        price: number;
        originalPrice: number;
        badgeText: string;
    }[];
}

export interface PerfumeOfferInfo {
    offer_name: string;
    text: string;
}

export type DetailedPerfume = {
    id: string;
    name: string;
    slug: string;
    description: string;
    fragrance: string;
    coverImage: string;
    rating: number;
    rating_count: number;
    images: string[];
    gender: "Men" | "Women" | "Unisex";
    price: {
        id: string;
        quantity: number;
        price: number;
        originalPrice: number;
    }[];
    badgeText: string | null;
    offers: PerfumeOfferInfo[];
    productDescription: string;
    scentStory: string;
    usageTips: string;
    top_notes: string;
    middle_notes: string;
    base_notes: string;
    brandAndManufacturerInfo: string;
    concentration: string;
    bannerImage: string | null;
}

export type PerfumeCollection = {
    id: string;
    name: string;
    slug: string;
    banner_image_url: string;
    description?: string;
}