// components/FeaturedCollection.tsx
"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getTopPerfumes } from '@/utils/perfume';
import { Perfume } from '@/types/perfume';
import OnePerfumecard from './OnePerfumecard';



export default function FeaturedCollection() {
  const [perfumes, setperfumes] = useState<Perfume[]>([])

  useEffect(() => {
    const perfumes = getTopPerfumes()
    setperfumes(perfumes)
  }, [])

  return (
    <section className="py-12 bg-[#fcf9ee]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#ff5900]">BEST SELLERS</h2>
          <p className="text-md text-gray-700">Inspired Versions</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {perfumes.map((product) => (
           <OnePerfumecard key={product.id} perfume={product} />
          ))}
        </div>
        
        {/* View All Collections Button */}
        <div className="text-center mt-12">
          <Link 
            href="/perfume/collection?id=c0"
            className="inline-block bg-[#ff5900] hover:bg-[#ff6b1a] text-white font-bold py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
