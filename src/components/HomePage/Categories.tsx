'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { motion } from 'framer-motion'

export default function Categories() {
    const router = useRouter()
    const categories = [
        {
            slug: 'mens',
            name: 'Mens',
            image: '/category/mens.jpg',
            description: 'Premium menswear collection'
        },
        {
            slug: 'womens',
            name: 'Womens',
            image: '/category/womens.png',
            description: 'Elegant womens fashion'
        },
        {
            slug: 'kids',
            name: 'Kids',
            image: '/category/kids.jpeg',
            description: 'Stylish kids clothing'
        },
        {
            slug: 'perfumes',
            name: 'Perfumes',
            image: '/category/perfumes.jpg',
            description: 'Luxury perfumes'
        },
        {
            slug: 'gifts',
            name: 'Gifts',
            image: '/category/gifts.jpg',
            description: 'Luxury gifts'
        }
    ]

    const handleCategoryClick = (categoryId: string) => {
        router.push(`/d/${categoryId}`)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 pt-16">

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-7xl mx-auto">
                {categories.map((category, index) => (
                    <motion.div
                        key={category.slug}
                        className="text-center cursor-pointer group transition-transform duration-300 hover:-translate-y-2"
                        onClick={() => handleCategoryClick(category.slug)}
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: index * 0.1,
                            ease: "easeOut"
                        }}
                    >
                        <div className="relative w-24 h-24 md:w-44 md:h-44 mx-auto mb-4 rounded-full overflow-hidden border-3 border-gray-200 group-hover:border-black group-hover:shadow-lg group-hover:shadow-[#D4AF37]/30 transition-all duration-300">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/5 pointer-events-none"></div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-wide">
                            {category.name}
                        </h3>
                        
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
