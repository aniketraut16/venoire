import DepartmentPageContent from "@/pagesview/DepartmentPage";
import { getCdn } from "@/utils/cdn";

export async function generateStaticParams() {
    try {
        const departments = await getCdn("collections");
        if (!departments.success || !departments.data?.collections) {
            return [];
        }
        return departments.data.collections
            .filter((collection: any) => collection.slug && typeof collection.slug === 'string')
            .map((collection: { slug: string }) => ({
                slug: collection.slug,
            }));
    } catch (error) {
        console.error("Error generating static params for collections:", error);
        return [];
    }
}
export default function DepartmentPage() {
    return <DepartmentPageContent />;
}