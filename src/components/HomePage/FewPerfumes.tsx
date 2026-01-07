"use client";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import Link from "next/link";
import { motion } from "framer-motion";
import { useHomepage } from "@/contexts/HomepageContext";
import { Perfume } from "@/types/perfume";
import { FaStar } from "react-icons/fa6";

export default function FewPerfumes() {
  const { featuredPerfumes: perfumes, isLoading: loading } = useHomepage();
  const displayPerfumes = perfumes.slice(0, 4) as unknown as Perfume[];
  return (
    <section className="w-full pb-8 sm:pb-12 md:pb-16 bg-linear-to-b from-white to-gray-50">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-8 sm:pb-12 md:pb-14 pt-4 text-center">
        <motion.h2
          className="text-section uppercase mb-4 sm:mb-5 md:mb-6"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Featured Perfumes
        </motion.h2>
        <motion.p
          className="text-body text-gray-600 leading-relaxed mb-6 sm:mb-7 md:mb-8 max-w-3xl mx-auto px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          Explore our handpicked selection of exquisite fragrances, each crafted
          to perfection. Discover scents that define luxury, elegance, and your
          unique personality.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          <Link
            href="/perfume/collection"
            className="inline-block px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 bg-black text-white text-body tracking-widest uppercase hover:bg-gray-800 transition-colors duration-300"
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
        ) : displayPerfumes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No perfumes available at the moment.
            </p>
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
            onStackComplete={() => console.log("Stack complete")}
          >
            {displayPerfumes.map((perfume) => (
              <ScrollStackItem key={perfume.id} itemClassName={`bg-white`}>
                <div className="flex flex-col lg:flex-row items-stretch justify-between h-full gap-4 md:gap-6 lg:gap-8">
                  {/* Left Side - Image with Badge */}
                  <div className="relative shrink-0 w-full lg:w-72 xl:w-80 flex items-center justify-center">
                    {/* Product Image */}
                    <div className="relative w-full overflow-hidden">
                      <img
                        src={perfume.coverImage}
                        alt={perfume.name}
                        className="w-full h-full object-contain aspect-square rounded-xl"
                        style={{
                          mixBlendMode: "multiply",
                          filter: "none",
                          WebkitFilter: "none",
                          backdropFilter: "none",
                          WebkitBackdropFilter: "none",
                          imageRendering: "-webkit-optimize-contrast",
                          backfaceVisibility: "visible",
                          transform: "translateZ(0)",
                          WebkitTransform: "translateZ(0)"
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Side - Product Details */}
                  <div className="flex-1 flex flex-col">
                    {/* Top Content Group */}
                    <div className="flex-1 space-y-3">
                      {/* Title and Gender */}
                      <div>
                        <h3 className="text-display tracking-tight text-gray-900">
                          {perfume.name}
                        </h3>
                        <p className="text-meta text-gray-600 uppercase tracking-wide">
                          FOR {perfume.gender}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <FaStar className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-body font-semibold text-gray-900">
                          {parseFloat(perfume.rating.toString()).toFixed(1)}
                        </span>
                        <span className="text-body text-gray-400">|</span>
                        {/* <FaCheckCircle className="w-3 h-3 text-blue-500" /> */}
                        <svg
                          viewBox="0 0 18 18"
                          className="w-3 h-3 text-blue-500"
                          height="14"
                          width="14"
                          preserveAspectRatio="xMidYMid meet"
                          version="1.1"
                          x="0px"
                          y="0px"
                          enableBackground="new 0 0 18 18"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polygon
                            id="Star-2"
                            fill="#005eff"
                            points="9,16 7.1,16.9 5.8,15.2 3.7,15.1 3.4,13 1.5,12 2.2,9.9 1.1,8.2 2.6,6.7 2.4,4.6 4.5,4 5.3,2 7.4,2.4 9,1.1 10.7,2.4 12.7,2 13.6,4 15.6,4.6 15.5,6.7 17,8.2 15.9,9.9 16.5,12 14.7,13 14.3,15.1 12.2,15.2 10.9,16.9 "
                          ></polygon>
                          <polygon
                            id="Check-Icon"
                            fill="#FFFFFF"
                            points="13.1,7.3 12.2,6.5 8.1,10.6 5.9,8.5 5,9.4 8,12.4 "
                          ></polygon>
                        </svg>
                        <span className="text-body text-gray-600">
                          (
                          {perfume.rating_count >= 1000
                            ? `${(perfume.rating_count / 1000).toFixed(1)}K`
                            : perfume.rating_count}{" "}
                          Reviews)
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-body text-gray-700 leading-relaxed max-w-2xl">
                        {perfume.description.slice(0, 160)}...
                      </p>

                      {/* Fragrance Notes */}
                      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div>
                          <h4 className="text-meta font-medium text-gray-900 uppercase mb-1">
                            Fragrance Family:
                          </h4>
                          <p className="text-meta text-gray-600">
                            {perfume.fragrance || "N/A"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-meta font-medium text-gray-900 uppercase mb-1">
                            Concentration:
                          </h4>
                          <p className="text-meta text-gray-600">
                            {perfume.concentration || "N/A"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-meta font-medium text-gray-900 uppercase mb-1">
                            Base Notes:
                          </h4>
                          <p className="text-meta text-gray-600">
                            {perfume.base_notes?.replace(/\([^)]*\)/g, '').trim() || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button - Pinned to Bottom */}
                    <div className="pt-2">
                      <Link
                        href={`/perfume/${perfume.slug}`}
                        className="w-full flex items-center justify-between bg-black text-white px-6 py-3 text-body font-bold uppercase tracking-wider hover:bg-gray-800 transition-all duration-300"
                      >
                        <span>VIEW {perfume.price[0]?.quantity}ML</span>
                        <span className="flex items-center gap-3">
                          {perfume.price[0]?.originalPrice >
                            perfume.price[0]?.price && (
                            <span className="line-through text-gray-400">
                              ₹
                              {perfume.price[0]?.originalPrice.toLocaleString()}
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
