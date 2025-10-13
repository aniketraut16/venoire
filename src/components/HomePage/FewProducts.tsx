"use client"
import React, { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getProducts } from '@/utils/products'
import ProductCard from '../Product/ProductCard'

const categories = ['ALL', 'MEN', 'WOMEN', 'BOYS', 'GIRLS']

export default function FewProducts() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Get products based on active category - for demo using "Trending" catalog
  const products = getProducts("Trending", 10)
  
  // Products that should show "LAST FEW LEFT" badge (randomly selected for demo)
  const lastFewLeftProducts = [products[1]?.id, products[2]?.id, products[4]?.id]

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-light text-yellow-400 mb-8 tracking-wide">
            Trending Styles
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-medium tracking-wider transition-colors duration-200 ${
                  activeCategory === category
                    ? 'text-white border-b-2 border-yellow-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Scrollable Products Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-none w-80 relative">
                {/* Last Few Left Badge */}
                {lastFewLeftProducts.includes(product.id) && (
                  <div className="absolute top-4 left-4 z-20 bg-pink-500 text-white px-3 py-1 text-xs font-semibold rounded">
                    LAST FEW LEFT
                  </div>
                )}
                
                {/* Product Card with custom styling for dark theme */}
                
                  <ProductCard {...product} mode="light" />
                
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Border Line */}
        <div className="mt-12 border-b border-yellow-400/30"></div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
