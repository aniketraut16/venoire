import AllProductTemplate from '@/pages/AllProductsTemplate'
import React from 'react'

export default function AllProductPage() {
    return (
        <AllProductTemplate filters={{
            department: false,
            category: false,
            subCategory: false,
        }} slug={null}
            headers={
                {
                    title: 'All Products',
                    description: 'Browse and filter our complete collection to find your perfect product. ',
                }
            }
        />
    )
}
