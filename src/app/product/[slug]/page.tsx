import { getProductsslugs } from '@/utils/products';
import OneProductPage from '@/pages/OneProductPage';


export async function generateStaticParams() {
    const products = await getProductsslugs();
    return products.map(product => ({
        slug: product,
    }));
}

export default function OneProductPageContent() {
    return <OneProductPage />;
}