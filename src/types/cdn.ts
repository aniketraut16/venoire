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
    }
}