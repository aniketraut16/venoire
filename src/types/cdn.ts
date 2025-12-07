export interface CdnResponse {

    success: boolean;
    message: string;
    data: {
        categories: {
            slug: string;
        }[];
        collections: {
            slug: string;
        }[];
        tags: {
            slug: string;
        }[];
        products: {
            slug: string;
        }[];
        perfumes: {
            slug: string;
        }[];
    }
}


export interface SearchResponse {
    success: boolean;
    message: string;
    data: {
        products: {
            id: string;
            name: string;
            slug: string;
            description: string;
        }[];
        categories: {
            id: string;
            name: string;
            slug: string;
            description: string;
        }[];
        collections: {
            id: string;
            name: string;
            slug: string;
            description: string;
            collection_type: string;
        }[];
    }
}