'use client'
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import Link from "next/link";
import Image from "next/image";

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
    <section className="w-full bg-gradient-to-b from-white to-gray-50">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-32 text-center">
        <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
          The Art of
          <span className="block font-serif italic text-5xl md:text-7xl mt-2">
            Perfumery
          </span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
          Discover the exceptional qualities that make our fragrances a testament to luxury, 
          craftsmanship, and timeless elegance. Each bottle tells a unique story.
        </p>
        <Link
          href="/perfume"
          className="inline-block px-8 py-4 bg-black text-white text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors duration-300"
        >
          Explore Collection
        </Link>
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
              <div className="flex flex-col md:flex-row items-center justify-between h-full gap-8">
                {/* Text Content */}
                <div className="flex-1 space-y-4">
                  <div className="inline-block px-3 py-1 bg-black/5 rounded-full">
                    <span className="text-xs font-medium tracking-wider uppercase text-gray-700">
                      Quality {index + 1}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900">
                    {quality.title}
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {quality.description}
                  </p>
                </div>

                {/* Image */}
                <div className="flex-shrink-0 w-full md:w-64 h-48 md:h-64 relative">
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl"></div>
                  <Image
                    src={quality.image}
                    alt={quality.title}
                    fill
                    className="object-contain p-6 drop-shadow-2xl"
                    sizes="(max-width: 768px) 100vw, 256px"
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
