
import React from 'react'
import AllProductTemplate from './AllProductsTemplate';
import { useParams } from 'next/navigation';
import { getCategoryBySlug } from '@/utils/category';

export default function CategoryPageContent() {
    const params = useParams();
    const slug = params?.slug as string;
    const category = getCategoryBySlug(slug);
    return (
        <AllProductTemplate
            filters={{
                department: true,
                category: false,
                subCategory: false,
            }}
            slug={slug}
            headers={{
                title: category?.title || '',
                description: category?.description || '',
            }}
        />
    )
}
