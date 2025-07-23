import { getAllCategories } from "@/utils/category";
import CategoryPageContent from "@/pages/CategoryPage";

export async function generateStaticParams() {
    const categories = await getAllCategories();
    return categories.map(category => ({
        slug: category.slug,
    }));
}
export default function CategoryPage() {
    return <CategoryPageContent />;
}