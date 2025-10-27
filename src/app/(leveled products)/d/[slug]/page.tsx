import AllProductPageMiddleware from "@/pagesview/AllProductPageMiddleware";
import { getCdn } from "@/utils/cdn";

export async function generateStaticParams() {
    try {
        const collections = await getCdn("collections");
        if (!collections.success || !collections.data?.collections) {
            return [];
        }
        return collections.data.collections
            .filter((collection: any) => collection.slug && typeof collection.slug === 'string')
            .map((collection: { slug: string }) => ({
                slug: collection.slug,
            }));
    } catch (error) {
        console.error("Error generating static params for collections:", error);
        return [];
    }
}
export default function CollectionPage() {
    return <AllProductPageMiddleware slug_type="collection" />;
}