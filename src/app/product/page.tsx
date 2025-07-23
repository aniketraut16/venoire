import AllProductTemplate from '@/pages/AllProductsTemplate'
import React from 'react'

export default function AllProductPage() {
    return (
        <AllProductTemplate filters={{
            department: false,
            category: false,
            subCategory: false,
        }} slug={null} />
    )
}
