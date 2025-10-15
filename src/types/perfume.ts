export type Perfume = {
    id: string;
    name: string;
    slug: string;
    description: string;
    fragrance: string;
    coverImage: string;
    images: string[];
    gender: "Men" | "Women" | "Unisex";
    price: {
        quantity: number;
        price: number;
        originalPrice: number;
    }[];
    productDescription: string;
    scentStory: string;
    usageTips: string;
    ingredients: string;
    brandAndManufacturerInfo: string;
}

export type PerfumeCollection = {
    id: string;
    name: string;
    description: string;
    coverImage: string;
    perfumes: Perfume[];
}