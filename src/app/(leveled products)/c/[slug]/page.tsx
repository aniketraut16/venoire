import AllProductPageMiddleware from "@/pagesview/AllProductPageMiddleware";
import { getCdn } from "@/utils/cdn";

export async function generateStaticParams() {
    try {
        const categories = await getCdn("categories");
        if (!categories.success || !categories.data?.categories) {
            return [];
        }
        return categories.data.categories
            .filter((category: any) => category.slug && typeof category.slug === 'string')
            .map((category: { slug: string }) => ({
                slug: category.slug,
            }));
    } catch (error) {
        console.error("Error generating static params for categories:", error);
        return [];
    }
}
export default function CategoryPage() {
    return <AllProductPageMiddleware slug_type="category" />;
}