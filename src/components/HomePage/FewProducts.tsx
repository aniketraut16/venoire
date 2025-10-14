"use client"
import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getProducts } from '@/utils/products'
import ProductCard from '../Product/ProductCard'
import { motion } from 'framer-motion'

const categories = ['ALL', 'MEN', 'WOMEN', 'BOYS', 'GIRLS']

export default function FewProducts() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showArrows, setShowArrows] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Get products based on active category - for demo using "Trending" catalog
  const products = getProducts("Trending", 10)
  
  // Products that should show "LAST FEW LEFT" badge (randomly selected for demo)
  const lastFewLeftProducts = [products[1]?.id, products[2]?.id, products[4]?.id]

  // Calculate scroll progress and check if arrows should be shown
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        const maxScroll = scrollWidth - clientWidth
        const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0
        setScrollProgress(progress)
        setShowArrows(maxScroll > 10) // Show arrows only if there's content to scroll
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      // Initial calculation
      handleScroll()
      
      // Recalculate on window resize
      window.addEventListener('resize', handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
      window.removeEventListener('resize', handleScroll)
    }
  }, [products])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 200 : 300
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 200 : 300
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-slate-900 to-slate-800 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Title */}
        <motion.div 
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-yellow-400 mb-4 sm:mb-6 md:mb-8 tracking-wide px-2">
            Trending Styles
          </h2>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-12 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8 px-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium tracking-wider transition-colors duration-200 whitespace-nowrap ${
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
          {/* Left Arrow - Hidden on mobile, shown on tablet+ */}
          {showArrows && (
            <button
              onClick={scrollLeft}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-2.5 md:p-3 hover:bg-white/20 transition-colors duration-200 shadow-lg"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </button>
          )}

          {/* Right Arrow - Hidden on mobile, shown on tablet+ */}
          {showArrows && (
            <button
              onClick={scrollRight}
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-2.5 md:p-3 hover:bg-white/20 transition-colors duration-200 shadow-lg"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </button>
          )}

          {/* Scrollable Products Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto overflow-y-visible scrollbar-hide px-1 sm:px-8 md:px-10 lg:px-12 snap-x snap-mandatory"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none', 
              WebkitOverflowScrolling: 'touch',
              overscrollBehaviorX: 'contain',
              // overscrollBehaviorY: 'none'
            }}
          >
            {products.map((product, index) => (
              <motion.div 
                key={product.id} 
                className="flex-none w-[75vw] sm:w-[45vw] md:w-[350px] lg:w-80 relative snap-start"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ 
                  duration: 0.5, 
                  delay: isMobile && index < 2 ? 0 : index * 0.1,
                  ease: "easeOut" 
                }}
              >
                  <ProductCard {...product} mode="light" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll Progress Indicator */}
        <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 relative mx-2 sm:mx-4">
          {/* Background track */}
          <div className="w-full h-0.5 sm:h-1 bg-yellow-400/30 rounded-full"></div>
          {/* Progress bar */}
          <div 
            className="absolute top-0 left-0 h-0.5 sm:h-1 bg-yellow-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>

        {/* Mobile Scroll Hint */}
        <div className="sm:hidden text-center mt-4">
          <p className="text-xs text-gray-400 animate-pulse">
            Swipe to see more
          </p>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
