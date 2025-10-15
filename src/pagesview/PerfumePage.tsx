import HeroSlideshow from '@/components/Perfume/HeroSlideshow';
import RichText from '@/components/Perfume/RichText';
import FeaturedCollection from '@/components/Perfume/FeaturedCollection';
import FeaturedProduct from '@/components/Perfume/FeaturedProduct';
import MediaGallery from '@/components/Perfume/MediaGallery';
import Why from '@/components/Perfume/Why';

export default function PerfumePage() {
  return (
    <main className="min-h-screen">
      <HeroSlideshow />
      <RichText
        titleParts={[
          { text: 'OOAK PERFUMES REDEFINES', color: '#242424' },
          { text: 'LUXURY PERFUMERY', color: '#ff5900', underline: true }
        ]}
        descriptionParts={[
          { text: 'We specialize in crafting exquisite ', color: '#242424' },
          { text: 'fragrances designed for the discerning individual.', color: '#ff5900' },
          { text: '\nUnlike mass-produced perfumes, we create ', color: '#242424' },
          { text: 'limited batches', color: '#ff5900' },
          { text: ', ensuring your scent remains a personal statement.', color: '#242424' }
        ]}
      />
      <FeaturedCollection />
      <FeaturedProduct />
      <MediaGallery />
      <Why />

    </main>
  );
}