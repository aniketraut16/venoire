'use client'
import React from 'react'
import AllProductTemplate from '../components/Product/AllProductsTemplate';
import { useParams } from 'next/navigation';

export default function TagPageContent() {
    const params = useParams();
    const slug = params?.slug as string;
    return (
        <AllProductTemplate
            filters={{
                department: false,
                category: false,
                tag: true,
            }}
            slug={slug}
            headers={{
                title: 'Tag',
                description: 'Tag Description',
            }}
        />
    )
}
