'use client'
import AllProductTemplate from '@/components/Product/AllProductsTemplate';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react'

function SearchPageContent() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams ? searchParams.get('query') : '';
    return <AllProductTemplate filters={{ department: false, category: false, tag: false }} slug={null} headers={{ title: 'Results for your query \"' + searchQuery + '\"', description: '' }} searchQuery={searchQuery} />
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPageContent />
        </Suspense>
    )
}
