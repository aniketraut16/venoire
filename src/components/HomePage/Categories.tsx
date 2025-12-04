'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { motion } from 'framer-motion'
import { CategoryorCollection } from '@/types/homepage'

export default function Categories({ categories }: { categories: CategoryorCollection[] }) {
    const router = useRouter()
        const handleCategoryClick = (slug: string) => {
            if(slug.includes('perfume')) {
                router.push(`/perfume/collection`)
                return
            }
        router.push(`/c/${slug}`)
    }

    return (
        <div className="max-w-7xl mx-auto px-0 md:px-4 pt-8 md:pt-16">
            {/* Mobile: Horizontal Scrollable Single Row */}
            <div className="md:hidden overflow-x-auto scrollbar-hide pb-4">
                <div className="flex gap-6 px-2 items-center justify-evenly">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.slug}
                            className="flex-none text-center cursor-pointer group transition-transform duration-300 active:scale-95"
                            onClick={() => handleCategoryClick(category.slug)}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ 
                                duration: 0.5, 
                                delay: index * 0.05,
                                ease: "easeOut"
                            }}
                        >
                            <div className="relative w-24 h-24 mx-auto mb-2 rounded-full overflow-hidden border-2 border-gray-200 group-active:border-black transition-all duration-300">
                                <img
                                    src={category.image || '/fallback.png'}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/fallback.png'
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/5 pointer-events-none"></div>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                                {category.name}
                            </h3>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Desktop: Flex Layout - Centered */}
            <div className="hidden md:flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
                {categories.map((category: CategoryorCollection, index: number) => (
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
                        <div className="relative w-52 h-52 mx-auto mb-4 rounded-full overflow-hidden border-3 border-gray-200 group-hover:border-black group-hover:shadow-lg group-hover:shadow-[#D4AF37]/30 transition-all duration-300">
                            <img
                                src={category.image || '/fallback.png'}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                    e.currentTarget.src = '/fallback.png'
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/5 pointer-events-none"></div>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2 tracking-wide">
                            {category.name}
                        </h3>
                    </motion.div>
                ))}
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}
