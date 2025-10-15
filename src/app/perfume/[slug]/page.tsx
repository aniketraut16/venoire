import OnePerfumePage from "@/pagesview/OnePerfumePage";
import { perfumeslugcdn } from "@/utils/perfume";

export async function generateStaticParams() {
    const perfumes = await perfumeslugcdn();
    return perfumes.map(perfume => ({
        slug: perfume.slug,
    }));
}
export default function OnePerfumePageContent() {
    return <OnePerfumePage />;
}