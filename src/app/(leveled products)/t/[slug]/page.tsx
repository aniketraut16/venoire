import AllProductPageMiddleware from "@/pagesview/AllProductPageMiddleware";
import { getCdn } from "@/utils/cdn";

export async function generateStaticParams() {
    try {
        const tags = await getCdn("tags");
        if (!tags.success || !tags.data?.tags) {
            return [];
        }
        return tags.data.tags
            .filter((tag: any) => tag.slug && typeof tag.slug === 'string')
            .map((tag: { slug: string }) => ({
                slug: tag.slug,
            }));
    } catch (error) {
        console.error("Error generating static params for tags:", error);
        return [];
    }
}
export default function TagPage() {
    return <AllProductPageMiddleware slug_type="tag" />;
}