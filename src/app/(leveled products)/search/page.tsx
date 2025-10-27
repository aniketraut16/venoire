'use client'
import AllProductsPage from '@/pagesview/AllProductsPage';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react'

function SearchPageContent() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams ? searchParams.get('query') : '';
    return <AllProductsPage slug_type="none" slug={null} searchQuery={searchQuery} />
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPageContent />
        </Suspense>
    )
}
