'use client'
import { getDepartmentBySlug } from '@/utils/departments';
import { useParams } from 'next/navigation';
import React from 'react'
import AllProductTemplate from '../components/Product/AllProductsTemplate';

export default function DepartmentPageContent() {
    const params = useParams();
    const slug = params?.slug as string;
    const department = getDepartmentBySlug(slug);
    return (
        <AllProductTemplate
            filters={{
                department: true,
                category: false,
                subCategory: false,
            }}
            slug={slug}
            headers={{
                title: department?.title || '',
                description: department?.description || '',
            }}
        />
    )
}
