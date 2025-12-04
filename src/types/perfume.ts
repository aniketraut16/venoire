export type Perfume = {
    id: string;
    name: string;
    slug: string;
    description: string;
    images: string[];
    fragrance: string;
    coverImage: string;
    gender: "Mens" | "Womens" | "Unisex";
    price: {
        id: string;
        quantity: number;
        price: number;
        originalPrice: number;
    }[];
}

export type DetailedPerfume = {
    id: string;
    name: string;
    slug: string;
    description: string;
    fragrance: string;
    coverImage: string;
    images: string[];
    gender: "Men" | "Women" | "Unisex";
    price: {
        id: string;
        quantity: number;
        price: number;
        originalPrice: number;
    }[];
    productDescription: string;
    scentStory: string;
    usageTips: string;
    top_notes: string;
    middle_notes: string;
    base_notes: string;
    ingredients: string;
    brandAndManufacturerInfo: string;
    concentration: string;
}

export type PerfumeCollection = {
    id: string;
    name: string;
    slug: string;
    banner_image_url: string;
    description?: string;
}