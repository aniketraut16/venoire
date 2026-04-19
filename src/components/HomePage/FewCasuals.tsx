"use client"
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../Product/ProductCard'
import { motion } from 'framer-motion'
import { useHomepage } from '@/contexts/HomepageContext'
import { Product } from '@/types/product'

export default function FewCasuals() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showArrows, setShowArrows] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const featuredClothing:Product[] = [
    {
        "id": "b0699bdc-f26a-4906-ab17-89487ab8f95f",
        "slug": "olive-linen-shirt",
        "name": "Olive Linen Shirt",
        "category": "Casual Shirts",
        "catalog": "General",
        "price": 2200,
        "originalPrice": 2500,
        "badgeText": "",
        "discount": 21,
        "size": [
            {
                "id": "97ace1f3-b855-442c-9df8-ac53b5c6148e",
                "size": "44",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "c5a80e97-0666-4420-9e46-18c736c7d928",
                "size": "40",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "c0a63fc8-e718-43cb-89e0-255a008dbb79",
                "size": "46",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "0ee5e7e1-fa1e-4081-89b7-f9a46e4fe69b",
                "size": "38",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "b8edfce9-503d-4c56-ae47-7ae5a79a0a93",
                "size": "42",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            }
        ],
        "thumbnail": "https://venoire-dev2.s3.ap-south-1.amazonaws.com/products/thumbnail/product-thumbnail-1776608011326-c851e1.webp",
        "availabilityStatus": "in_stock"
    },
    {
        "id": "f9310986-19e9-4a59-bb91-45893ae5d760",
        "slug": "core-green-linen-shirt",
        "name": "Core Green Linen Shirt",
        "category": "Casual Shirts",
        "catalog": "General",
        "price": 2200,
        "originalPrice": 2500,
        "badgeText": "",
        "discount": 15,
        "size": [
            {
                "id": "9bef22ca-5ed0-4f1f-9a0f-bb56d2c17d3f",
                "size": "44",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "d5506183-3845-481e-a687-d28543bee141",
                "size": "46",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "0b0a51fa-e59f-402f-ab51-3d2bd92a811b",
                "size": "42",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "dc9c3429-909c-4a67-83c8-a6290435ab75",
                "size": "40",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "9e581211-196e-4ca4-b0d6-1689c76b5234",
                "size": "38",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            }
        ],
        "thumbnail": "https://venoire-dev2.s3.ap-south-1.amazonaws.com/products/thumbnail/product-thumbnail-1776607517219-b8f1de.webp",
        "availabilityStatus": "in_stock"
    },
    {
        "id": "03145d73-12b8-4631-a8fc-8238dd8d3a5f",
        "slug": "dark-grey-charcoal-edge-linen-shirt",
        "name": "Dark Grey Charcoal Edge Linen Shirt",
        "category": "Casual Shirts",
        "catalog": "General",
        "price": 2200,
        "originalPrice": 2500,
        "badgeText": "",
        "discount": 17,
        "size": [
            {
                "id": "b1b76cab-8b4a-4cd0-a260-57ea86943d0e",
                "size": "40",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "445d6d2d-1a94-4855-9017-b16415444825",
                "size": "38",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "dcd0010e-7ce3-4942-a143-f9369161e97a",
                "size": "42",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "e86cf98e-0558-4146-87a1-75fc7b9d133d",
                "size": "44",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "429805ca-edbd-4a0f-a0c4-a82aa5a24dba",
                "size": "46",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            }
        ],
        "thumbnail": "https://venoire-dev2.s3.ap-south-1.amazonaws.com/products/thumbnail/product-thumbnail-1776606116343-0909a4.webp",
        "availabilityStatus": "in_stock"
    },
    {
        "id": "3f597399-96eb-40bb-b281-7944d76a265c",
        "slug": "light-blue-linen-shirt",
        "name": "Light Blue Linen Shirt",
        "category": "Casual Shirts",
        "catalog": "General",
        "price": 2200,
        "originalPrice": 2500,
        "badgeText": "",
        "discount": 15,
        "size": [
            {
                "id": "241a43b5-0f12-43dd-940e-1f1d16f06bcb",
                "size": "44",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "fa3c4c53-7dd4-4a6b-b990-d4cea29db3e7",
                "size": "38",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "3bda99cf-4df1-4be8-aa45-badaa177b040",
                "size": "46",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "9a3662ef-e48a-427c-8423-7fee9fb79aac",
                "size": "42",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            },
            {
                "id": "5bedf5af-a168-4e4e-a93b-a1df31ebd52a",
                "size": "40",
                "price": 2200,
                "originalPrice": 2500,
                "badgeText": ""
            }
        ],
        "thumbnail": "https://venoire-dev2.s3.ap-south-1.amazonaws.com/products/thumbnail/product-thumbnail-1776605348745-92724a.webp",
        "availabilityStatus": "in_stock"
    }
]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        const maxScroll = scrollWidth - clientWidth
        const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0
        setScrollProgress(progress)
        setShowArrows(maxScroll > 10)
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      handleScroll()
      window.addEventListener('resize', handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
      window.removeEventListener('resize', handleScroll)
    }
  }, [featuredClothing])

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
    <section className="py-8 sm:py-12 md:py-16 bg-linear-to-b from-slate-900 to-slate-800 overflow-x-hidden mt-10 md:mt-0 mb-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Title */}
        <motion.div 
          className="text-center mb-6 sm:mb-8 md:mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-display font-light text-yellow-400 mb-2 sm:mb-3 tracking-wide px-2">
          Casual Essentials
          </h2>
          <p className="text-body text-gray-300 px-4">
          Effortless style for everyday comfort
          </p>
        </motion.div>

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
            }}
          >
            {featuredClothing.map((product, index) => (
              <motion.div 
                key={product.id} 
                className="flex-none w-[75vw] sm:w-[45vw] md:w-[350px] lg:w-80 relative snap-start"
                initial={{ opacity: 0, x: 50 }}
                animate={isMobile && shouldAnimate ? { opacity: 1, x: 0 } : undefined}
                whileInView={!isMobile ? { opacity: 1, x: 0 } : undefined}
                viewport={!isMobile ? { once: true, amount: 0.2 } : undefined}
                transition={{ 
                  duration: 0.5, 
                  delay: isMobile ? index * 0.1 : Math.min(index * 0.05, 0.5),
                  ease: "easeOut" 
                }}
                onViewportEnter={() => {
                  if (isMobile && index === 0 && !shouldAnimate) {
                    setShouldAnimate(true)
                  }
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
