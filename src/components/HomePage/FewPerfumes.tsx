'use client'
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import Link from "next/link";
import { motion } from "framer-motion";

const perfumeQualities = [
  {
    title: "Artisan Craftsmanship",
    description: "Each fragrance is meticulously crafted by master perfumers using traditional techniques passed down through generations. Our artisanal approach ensures every bottle captures the essence of luxury.",
    image: "/perfume/artisan-blend.png",
    color: "from-amber-50 to-orange-50"
  },
  {
    title: "Rare & Niche Ingredients",
    description: "We source the finest and rarest ingredients from around the world. From Bulgarian rose to Indonesian oud, each component is carefully selected for its exceptional quality and unique character.",
    image: "/perfume/niche-ingredients.png",
    color: "from-rose-50 to-pink-50"
  },
  {
    title: "Sustainable & Cruelty-Free",
    description: "Our commitment to ethical luxury means all our fragrances are cruelty-free and sustainably sourced. We believe in creating beauty without compromise, respecting both nature and all living beings.",
    image: "/perfume/cruelty-free.png",
    color: "from-emerald-50 to-teal-50"
  },
  {
    title: "Personalized Experience",
    description: "Every individual is unique, and so should be their fragrance journey. Our expert consultants provide personalized recommendations to help you discover your perfect scent signature.",
    image: "/perfume/personalization.png",
    color: "from-violet-50 to-purple-50"
  }
];

export default function FewPerfumes() {
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
          The Art of
          <span className="block font-serif italic text-5xl xl:text-6xl mt-1 sm:mt-2">
            Perfumery
          </span>
        </motion.h2>
        <motion.p 
          className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-7 md:mb-8 max-w-2xl mx-auto px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          Discover the exceptional qualities that make our fragrances a testament to luxury, 
          craftsmanship, and timeless elegance. Each bottle tells a unique story.
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
          {perfumeQualities.map((quality, index) => (
            <ScrollStackItem key={index} itemClassName={`bg-gradient-to-br ${quality.color}`}>
              <div className="flex flex-col md:flex-row items-center justify-between h-full gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8">
                {/* Text Content */}
                <div className="flex-1 space-y-3 sm:space-y-4 text-center md:text-left">
                  <div className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 bg-black/5 rounded-full">
                    <span className="text-sm font-medium tracking-wider uppercase text-gray-700">
                      Quality {index + 1}
                    </span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-light tracking-tight text-gray-900">
                    {quality.title}
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {quality.description}
                  </p>
                </div>

                {/* Image */}
                <div className="flex-shrink-0 w-full sm:w-56 md:w-64 h-40 sm:h-48 md:h-64 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl"></div>
                  <img
                    src={quality.image}
                    alt={quality.title}
                    className="object-cover w-full h-full p-4 sm:p-5 md:p-6 drop-shadow-2xl object-center rounded-2xl overflow-hidden"
                  />
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

    </section>
  );
}
