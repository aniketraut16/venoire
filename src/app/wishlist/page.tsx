"use client"

import ProductCard from '@/components/Product/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types/product';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useCart } from '@/contexts/cartContext';
import { getWishlist } from '@/utils/wishlist';

export default function page() {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const { token } = useAuth();
    const { removeFromWishlist } = useCart();
    useEffect(() => {
        if (token) {
            getWishlist(token).then((wishlist) => {
                setWishlist(wishlist);
            });
        }
    }, [token]);
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
                                <div className="flex gap-2 w-full">
                                    <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="border border-gray-300 text-gray-700 px-4 py-2  flex-1 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer">
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
