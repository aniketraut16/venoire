// components/MediaGallery.tsx
import Image from 'next/image';

const featureItems = [
  {
    id: 2,
    type: 'image',
    src: '/perfume/personalization.png',
    title: 'Full Personalization',
    description: 'Create your own signature scent with custom names, bottle engravings, and tailored fragrance notes.',
    span: 'col-span-1 md:col-span-2 row-span-1',
  },
  {
    id: 1,
    type: 'image',
    src: '/perfume/artisan-blend.png',
    title: 'Artisan Crafted Scents',
    description: 'Each fragrance is meticulously handcrafted in small batches, ensuring uniqueness and exceptional quality.',
    span: 'col-span-1 md:col-span-3 row-span-2',
  },
  {
    id: 3,
    type: 'image',
    src: '/perfume/niche-ingredients.png',
    title: 'Rare & Premium Ingredients',
    description: 'We only use high-quality, ethically sourced ingredients, making our perfumes long-lasting and luxurious.',
    span: 'col-span-1 md:col-span-2 row-span-1',
  },
  
  {
    id: 4,
    type: 'image',
    src: '/perfume/cruelty-free.png',
    title: 'Vegan & Cruelty Free',
    description: 'Our entire collection is vegan and never tested on animals, for an ethical perfume experience.',
    span: 'col-span-1 md:col-span-5 row-span-1',
  }
];

export default function MediaGallery() {
  return (
    <section className="py-15 md:py-7 bg-[#fcf9ee]">
      <div className="max-w-[1410px] mx-auto px-6 md:px-20">
        <div className="text-center mt-6 mb-12">
          <h2 className="text-2xl md:text-4xl font-heading text-[#ff5900] mb-2 leading-tight">
          What Makes Our Perfumes Unique
          </h2>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-[#242424] opacity-95">
          Discover the art and ethics behind every bottle — from handcrafted blends to personalized touches, each perfume reflects our commitment to quality, creativity, and conscious luxury.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {featureItems.map((item) => (
            <FeatureCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ item }: { item: typeof featureItems[0] }) {
  return (
    <div className={`${item.span} relative group overflow-hidden rounded-lg min-h-[240px] md:min-h-[320px]`}>
      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={item.src}
          alt={item.title}
          className="object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 text-white z-10">
        <h3 className="text-xl md:text-2xl font-heading mb-2 font-semibold drop-shadow">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-sm md:text-base mb-2 opacity-95 drop-shadow">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}