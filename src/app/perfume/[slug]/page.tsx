import OnePerfumePage from "@/pagesview/OnePerfumePage";
import { perfumeslugcdn } from "@/utils/perfume";

export async function generateStaticParams() {
    try {
        const perfumes = await perfumeslugcdn();
        if (!perfumes || !Array.isArray(perfumes)) {
            return [];
        }
        return perfumes
            .filter((perfume: any) => perfume.slug && typeof perfume.slug === 'string')
            .map(perfume => ({
                slug: perfume.slug,
            }));
    } catch (error) {
        console.error("Error generating static params for perfumes:", error);
        return [];
    }
}
export default function OnePerfumePageContent() {
    return <OnePerfumePage />;
}