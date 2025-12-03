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
                <div className="flex flex-col md:flex-row items-center justify-between h-full gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8">
                  {/* Text Content */}
                  <div className="flex-1 space-y-3 sm:space-y-4 text-center md:text-left">
                    <div className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 bg-black/5 rounded-full">
                      <span className="text-sm font-medium tracking-wider uppercase text-gray-700">
                        {perfume.gender}
                      </span>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-light tracking-tight text-gray-900">
                      {perfume.name}
                    </h3>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                      {perfume.fragrance}
                    </p>
                    <div className="pt-2">
                      <span className="text-2xl font-semibold text-gray-900">
                        ₹{perfume.price[0]?.price.toLocaleString()}
                      </span>
                      {perfume.price[0]?.originalPrice > perfume.price[0]?.price && (
                        <span className="ml-3 text-lg text-gray-500 line-through">
                          ₹{perfume.price[0]?.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="pt-4">
                      <Link
                        href={`/perfume/${perfume.slug}`}
                        className="inline-block px-6 py-2.5 bg-black text-white text-sm font-medium tracking-widest uppercase hover:bg-gray-800 transition-all duration-300"
                      >
                        View
                      </Link>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="flex-shrink-0 w-full sm:w-56 md:w-64 h-40 sm:h-48 md:h-64 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl"></div>
                    <img
                      src={perfume.coverImage}
                      alt={perfume.name}
                      className="object-cover w-full h-full p-4 sm:p-5 md:p-6 drop-shadow-2xl object-center rounded-2xl overflow-hidden"
                    />
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
