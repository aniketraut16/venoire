import { getAllSubcategories } from "@/utils/subcategory";
import SubCategoryPageContent from "@/pagesview/SubCategoryPage";

export async function generateStaticParams() {
    const subcategories = await getAllSubcategories();
    return subcategories.map(subcategory => ({
        slug: subcategory.slug,
    }));
}
export default function SubCategoryPage() {
    return <SubCategoryPageContent />;
}