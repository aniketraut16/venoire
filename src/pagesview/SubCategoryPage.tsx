'use client'
import React from 'react'
import AllProductTemplate from '../components/Product/AllProductsTemplate';
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
                tag: true,
            }}
            slug={slug}
            headers={{
                title: subcategory?.title || '',
                description: subcategory?.description || '',
            }}
        />
    )
}
