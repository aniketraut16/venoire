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
            thumbnail_url: string;
            description: string;
        }[];
        categories: {
            id: string;
            name: string;
            slug: string;
            description: string;
            thumbnail_url: string;
        }[];
        collections: {
            id: string;
            name: string;
            slug: string;
            description: string;
            collection_type: string;
            thumbnail_url: string;
        }[];
    }
}