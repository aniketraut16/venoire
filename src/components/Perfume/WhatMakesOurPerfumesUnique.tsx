
const featureItems = [
  {
    id: 1,
    type: 'image',
    src: '/perfume/curated-scents.png',
    title: 'Carefully Curated Scents',
    description: 'Each fragrance is designed with a distinct character — refined, balanced, and made to be effortlessly wearable.',
    span: 'col-span-1 md:col-span-3 row-span-2',
    position: 'object-center',
  },
  {
    id: 2,
    type: 'image',
    src: '/perfume/small-batch.png',
    title: 'Small-Batch Production',
    description: 'Produced in limited quantities to maintain consistency, control, and attention to detail.',
    span: 'col-span-1 md:col-span-2 row-span-1',
    position: 'object-bottom',
  },
  {
    id: 3,
    type: 'image',
    src: '/perfume/quality-ingredients.png',
    title: 'High-Quality Ingredients',
    description: 'We focus on well-balanced compositions using quality ingredients for a lasting impression.',
    span: 'col-span-1 md:col-span-2 row-span-1',
    position: 'object-center',
  },
  {
    id: 4,
    type: 'image',
    src: '/perfume/vegan-cruelty-free.png',
    title: 'Vegan & Cruelty-Free',
    description: 'Our fragrances are vegan and never tested on animals.',
    span: 'col-span-1 md:col-span-5 row-span-1',
    position: 'object-center',
  }
];


export default function WhatMakesOurPerfumesUnique() {
  return (
    <section className="py-15 md:py-7 bg-white">
      <div className="max-w-[1410px] mx-auto px-6 md:px-20">
        <div className="text-center mt-6 mb-12">
          <h2 className="text-section text-[#0f182c] mb-2 leading-tight">
          What Makes Our Perfumes Unique
          </h2>
          <p className="max-w-2xl mx-auto text-body text-[#242424] opacity-95">
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
          className={`${item.position}`}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 text-white z-10">
        <h3 className="text-section text-white mb-2 font-semibold drop-shadow">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-body mb-2 opacity-95 drop-shadow">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}