import React from 'react'
import AllProductTemplate from './AllProductsTemplate';
import { useParams } from 'next/navigation';
import { getSubcategoryBySlug } from '@/utils/subcategory';

export default function SubCategoryPageContent() {
    const params = useParams();
    const slug = params?.slug as string;
    const subcategory = getSubcategoryBySlug(slug);
    return (
        <AllProductTemplate
            filters={{
                department: true,
                category: true,
                subCategory: true,
            }}
            slug={slug}
            headers={{
                title: subcategory?.title || '',
                description: subcategory?.description || '',
            }}
        />
    )
}
