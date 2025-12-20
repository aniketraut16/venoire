// components/FeaturedCollection.tsx
"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPerfumes, getPerfumeCollections } from '@/utils/perfume';
import { Perfume } from '@/types/perfume';
import OnePerfumecard from './OnePerfumecard';

export default function FeaturedCollection() {
  const [perfumes, setperfumes] = useState<Perfume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [firstCollectionSlug, setFirstCollectionSlug] = useState<string>('')

  useEffect(() => {
    const fetchPerfumes = async () => {
      setIsLoading(true)
      const allPerfumes = await getPerfumes()
      setperfumes(allPerfumes.slice(0, 8))
      
      const collections = await getPerfumeCollections()
      if (collections && collections.length > 0) {
        setFirstCollectionSlug(collections[0].slug)
      }
      
      setIsLoading(false)
    }
    fetchPerfumes()
  }, [])

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0f182c]">BEST SELLERS</h2>
            
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#0f182c]">BEST SELLERS</h2>
      
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {perfumes.slice(0, 4).map((product) => (
           <OnePerfumecard key={product.id} perfume={product} />
          ))}
        </div>
        
        {/* View All Collections Button */}
        <div className="text-center mt-12">
          <Link 
            href={`/perfume/collection${firstCollectionSlug ? `?slug=${firstCollectionSlug}` : ''}`}
            className="inline-block bg-white hover:bg-black text-black hover:text-white  border border-black py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
