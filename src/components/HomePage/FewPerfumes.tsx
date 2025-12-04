'use client'
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getPerfumes } from "@/utils/perfume";
import { Perfume } from "@/types/perfume";

const gradientColors = [
  "from-amber-50 to-orange-50",
  "from-rose-50 to-pink-50",
  "from-emerald-50 to-teal-50",
  "from-violet-50 to-purple-50"
];

export default function FewPerfumes() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfumes = async () => {
      try {
        const data = await getPerfumes();
        // Get only first 4 perfumes
        setPerfumes(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching perfumes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfumes();
  }, []);
  return (
    <section className="w-full py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-32 text-center">
        <motion.h2 
          className="text-5xl xl:text-6xl font-light tracking-tight mb-4 sm:mb-5 md:mb-6"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Featured
          <span className="block font-serif italic text-5xl xl:text-6xl mt-1 sm:mt-2">
            Perfumes
          </span>
        </motion.h2>
        <motion.p 
          className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-7 md:mb-8 max-w-2xl mx-auto px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          Explore our handpicked selection of exquisite fragrances, each crafted to perfection. 
          Discover scents that define luxury, elegance, and your unique personality.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          <Link
            href="/perfume/collection"
            className="inline-block px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 bg-black text-white text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors duration-300"
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>

      {/* ScrollStack Section */}
      <div className="w-full">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Loading perfumes...</p>
          </div>
        ) : perfumes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No perfumes available at the moment.</p>
          </div>
        ) : (
          <ScrollStack 
            useWindowScroll={true}
            itemDistance={80}
            itemScale={0.04}
            itemStackDistance={20}
            stackPosition="25%"
            scaleEndPosition="10%"
            baseScale={0.92}
            onStackComplete={() => console.log('Stack complete')}
          >
            {perfumes.map((perfume, index) => (
              <ScrollStackItem key={perfume.id} itemClassName={`bg-gradient-to-br ${gradientColors[index % gradientColors.length]}`}>
                <div className="flex flex-col lg:flex-row items-start justify-between h-full gap-4 md:gap-6 lg:gap-8 p-4 sm:p-6 md:p-6 lg:p-6">
                  {/* Left Side - Image with Badge */}
                  <div className="relative flex-shrink-0 w-full lg:w-72 xl:w-80">
                    {/* Bestseller Badge */}
                    {index === 0 && (
                      <div className="absolute top-0 left-0 z-10 bg-red-600 text-white px-4 py-2 text-xs font-bold tracking-wider uppercase">
                        BESTSELLER
                      </div>
                    )}
                    
                    {/* Product Image */}
                    <div className="relative  overflow-hidden">
                      <img
                        src={perfume.coverImage}
                        alt={perfume.name}
                        className="object-contain max-w-full max-h-full aspect-square"
                        style={{
                          mixBlendMode: "multiply",
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Side - Product Details */}
                  <div className="flex-1 space-y-2 md:space-y-3">
                    {/* Title and Gender */}
                    <div>
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-1">
                        {perfume.name}
                      </h3>
                      <p className="text-lg sm:text-xl text-gray-600 uppercase tracking-wide">
                        FOR {perfume.gender}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-black text-lg">★</span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">31 reviews</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl">
                      Experience a captivating fragrance that speaks volumes with a heady blend of rich notes. A scent that doesn't just command attention—it stirs envy.
                    </p>

                    {/* Fragrance Notes */}
                    <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 uppercase mb-1">The Introduction:</h4>
                        <p className="text-xs text-gray-600">{perfume.fragrance.split(',')[0]?.trim() || 'Fresh & Vibrant'}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 uppercase mb-1">The Discovery:</h4>
                        <p className="text-xs text-gray-600">{perfume.fragrance.split(',')[1]?.trim() || 'Rich & Complex'}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 uppercase mb-1">The Impression:</h4>
                        <p className="text-xs text-gray-600">{perfume.fragrance.split(',')[2]?.trim() || 'Lasting & Memorable'}</p>
                      </div>
                    </div>

              

                    {/* Add to Cart Button */}
                    <div className="pt-2">
                      <Link
                        href={`/perfume/${perfume.slug}`}
                        className="w-full flex items-center justify-between bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-all duration-300"
                      >
                        <span>VIEW {perfume.price[0]?.quantity}ML</span>
                        <span className="flex items-center gap-3">
                          {perfume.price[0]?.originalPrice > perfume.price[0]?.price && (
                            <span className="line-through text-gray-400">
                              ₹{perfume.price[0]?.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="font-bold">
                            ₹{perfume.price[0]?.price.toLocaleString()}
                          </span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        )}
      </div>

    </section>
  );
}
