import { getProducts } from '@/utils/products';
import React from 'react'
import ProductCard from '../Product/ProductCard';

export default function CategorizedProducts(
    {
        title,
        description,
        catalog,
    }: {
        title: string;
        description: string;
        catalog: "Best Seller" | "New Arrival" | "Trending" | "Featured" | "Sale";
    }
) {
    const products = getProducts(catalog).slice(0, 4); // Only show 5 products

    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-wide">
                        {title}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        {description}
                    </p>
                </div>

                {/* Products Grid - 5 products in one line */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>

                {/* Explore Catalog Button */}
                <div className="text-center">
                    <button className="px-8 py-3 border border-gray-900 text-gray-900 uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-colors duration-300 cursor-pointer">
                        Explore {catalog}
                    </button>
                </div>
            </div>
        </section>
    )
}
