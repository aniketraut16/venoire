"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CategoryorCollection } from "@/types/homepage";
import { getCategories } from "@/utils/homepage";
import { useRouter } from "next/navigation";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CategoryorCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    const fetchCollections = async () => {
      setIsLoading(true);
      const { collections } = await getCategories();
      setCollections(collections);
      setIsLoading(false);
    };
    
    fetchCollections();
  }, []);

  const handleCollectionClick = (collection: CategoryorCollection) => {
    router.push(`/d/${collection.slug}`);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div 
        className="relative w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-white"
        style={{ height: '60vh' }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600')] bg-cover bg-center opacity-10"></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 tracking-wide">
              EXPLORE OUR COLLECTIONS
            </h1>
            <div className="w-24 h-1 bg-gray-900 mx-auto mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover curated collections that define elegance and sophistication. 
              Each collection tells a unique story of style and craftsmanship.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-[30px] h-[46px] border-2 border-gray-400/60 rounded-[30px] mx-auto">
            <svg height="30" width="10" className="mx-auto">
              <circle
                className="animate-scroll-down"
                cx="5"
                cy="15"
                r="2"
                fill="rgba(0, 0, 0, 0.4)"
              />
            </svg>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-sm"></div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No collections available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
                onClick={() => handleCollectionClick(collection)}
                className="relative overflow-hidden rounded-none group cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={collection.image || '/fallback.png'}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/fallback.png';
                    }}
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <h3 className="text-white text-lg sm:text-xl font-semibold tracking-wide mb-2">
                      {collection.name}
                    </h3>
                    <button className="bg-white text-gray-900 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium tracking-wider hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                      EXPLORE
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </button>
                  </motion.div>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg 
                      className="w-5 h-5 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore our full catalog or get in touch with our style consultants for personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => router.push('/search')}
                className="bg-gray-900 text-white px-8 py-3 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors"
              >
                BROWSE ALL PRODUCTS
              </button>
              <button 
                onClick={() => router.push('/contact')}
                className="border-2 border-gray-900 text-gray-900 px-8 py-3 text-sm font-medium tracking-wider hover:bg-gray-900 hover:text-white transition-colors"
              >
                CONTACT US
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-down {
          0% {
            opacity: 0;
            transform: translateY(-8px);
          }
          50% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(8px);
          }
        }
        .animate-scroll-down {
          animation: scroll-down 1.5s ease infinite;
        }
      `}</style>
    </div>
  );
}

