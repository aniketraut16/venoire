import AllProductTemplate from '@/pages/AllProductsTemplate'
import React from 'react'

export default function AllProductPage() {
    return (
        <AllProductTemplate filters={{
            department: true,
            category: true,
            subCategory: true,
        }} slug={null} />
    )
}
