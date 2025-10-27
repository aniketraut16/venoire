import OneProductPage from "@/pagesview/OneProductPage";
import { getCdn } from "@/utils/cdn";

export async function generateStaticParams() {
  try {
    const products = await getCdn("products");
    if (!products.success || !products.data?.products) {
      return [];
    }
    return products.data.products
      .filter((product: any) => product.slug && typeof product.slug === 'string')
      .map((product: { slug: string }) => ({
        slug: product.slug,
      }));
  } catch (error) {
    console.error("Error generating static params for products:", error);
    return [];
  }
}

export default function OneProductPageContent() {
  return <OneProductPage />;
}
