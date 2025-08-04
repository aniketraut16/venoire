"use client"

import ProductCard from '@/components/Product/ProductCard';
import { Product } from '@/types/product';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import React, { useState } from 'react'

export default function page() {
    const [wishlist, setWishlist] = useState<Product[]>([{
        id: "1",
        slug: "classic-crewneck-t-shirt",
        name: "Classic Crewneck T-Shirt",
        category: "T-Shirts",
        catalog: "Best Seller",
        price: 100,
        originalPrice: 150,
        discount: 30,
        size: ["42", "40", "38", "36"],
        thumbnail:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    },
    {
        id: "2",
        slug: "premium-oxford-shirt",
        name: "Premium Oxford Shirt",
        category: "Shirts",
        catalog: "Best Seller",
        price: 120,
        originalPrice: 180,
        discount: 33,
        size: ["42", "40", "38", "36"],
        thumbnail:
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
    },
    {
        id: "3",
        slug: "slim-fit-polo-shirt",
        name: "Slim Fit Polo Shirt",
        category: "T-Shirts",
        catalog: "Best Seller",
        price: 90,
        originalPrice: 130,
        discount: 31,
        size: ["42", "40", "38", "36"],
        thumbnail:
            "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=500&fit=crop",
    }]);
    return (
        <div>
            <div className="px-4 py-8 max-w-7xl pt-45 mx-auto ">
                <div className="p-8 border-b border-gray-200">
                    <h1 className="text-3xl font-light tracking-wide uppercase">Wishlist</h1>
                    <p className="text-gray-600 mt-2 text-sm">Your favorite items are here</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                    {wishlist.map((product: Product) => (
                        <div key={product.id}>
                            <ProductCard {...product} />
                            <div className="flex flex-col w-full gap-3 mt-3">
                                <button className="bg-black text-white px-4 py-2  flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-wide cursor-pointer">
                                    <ShoppingBag size={16} />
                                    <span>Add to Cart</span>
                                </button>
                                <div className="flex gap-2 w-full">
                                    <button className="border border-gray-300 text-gray-700 px-4 py-2  flex-1 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer">
                                        <Trash2 size={16} />
                                        <span>Remove</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
