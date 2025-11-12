import OnePerfumePage from "@/pagesview/OnePerfumePage";
import { getCdn } from "@/utils/cdn";

export async function generateStaticParams() {
  try {
    const perfumes = await getCdn("perfumes");
    if (!perfumes.success || !perfumes.data?.perfumes) {
      return [];
    }
    return perfumes.data.perfumes
      .filter((slug: any) => slug && typeof slug === 'string')
      .map((slug: { slug: string }) => ({
        slug: slug,
      }));
  } catch (error) {
    console.error("Error generating static params for perfumes:", error);
    return [];
  }
}

export default function OnePerfumePageContent() {
  return <OnePerfumePage />;
}