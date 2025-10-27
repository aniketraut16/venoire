'use client'
import AllProductsPage from './AllProductsPage';
import { useParams } from 'next/navigation';

export default function AllProductPageMiddleware(props:{
    slug_type: 'tag' | 'collection' | 'category' | 'none';
}) {
    const params = useParams();
    const slug = params?.slug as string;
    return (
        <AllProductsPage
            slug_type={props.slug_type}
            slug={slug}
            searchQuery={null}
        />
    )
}
