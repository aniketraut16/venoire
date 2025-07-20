import { Product } from '@/types/product'
import Image from 'next/image'
import React, { useState } from 'react'
import { Heart } from 'lucide-react'

export default function ProductCard(product: Product) {
    const [isHovered, setIsHovered] = useState(false)
    const sizes = product.size;

    return (
        <div
            className="group relative overflow-hidden  transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold border border-black`}>
                    {product.catalog}
                </div>

                {/* Heart Icon */}
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors duration-200" />
                </button>

                {/* Size Selection on Hover */}
                {isHovered && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                        <div className="flex gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`w-8 h-8 rounded-md text-sm font-medium transition-all duration-200 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="py-4 space-y-2 pt-serif-regular">

                {/* Category */}
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {product.category}
                </p>

                {/* Product Name */}
                <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                    {product.name}
                </h3>

                {/* Pricing */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium text-red-600">
                        {product.discount}% OFF
                    </span>
                </div>
            </div>
        </div>
    )
}
