import OnePerfumePage from "@/pagesview/OnePerfumePage";
import { getPerfumes } from "@/utils/perfume";

export async function generateStaticParams() {
    try {
        const perfumes = await getPerfumes();
        if (!perfumes || !Array.isArray(perfumes)) {
            return [];
        }
        return perfumes
            .filter((perfume) => perfume.slug && typeof perfume.slug === 'string')
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