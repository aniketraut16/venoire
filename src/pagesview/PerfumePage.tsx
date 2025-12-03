import HeroSlideshow from "@/components/Perfume/HeroSlideshow";
import RichText from "@/components/Perfume/RichText";
import FeaturedCollection from "@/components/Perfume/FeaturedCollection";
import FeaturedProduct from "@/components/Perfume/FeaturedProduct";
import MediaGallery from "@/components/Perfume/MediaGallery";
// import Why from '@/components/Perfume/Why';

export default function PerfumePage() {
  return (
    <main className="min-h-screen">
      <HeroSlideshow />
      <RichText
        titleParts={[
          { text: "VENOIRE", color: "#242424" },
          { text: "REDEFINES", color: "#0f182c" },
          { text: "MODERN LUXURY", color: "#242424", underline: true },
        ]}
        descriptionParts={[
          {
            text: "At Venoire, we believe fragrance is more than scent — ",
            color: "#242424",
          },
          { text: "it’s identity distilled into art.", color: "#0f182c" },
          {
            text: "\nEach creation is hand-blended in small ateliers, using ",
            color: "#242424",
          },
          { text: "meticulously sourced essences", color: "#0f182c" },
          { text: " from across the world.", color: "#242424" },
          { text: "\nEvery drop is an ode to ", color: "#242424" },
          { text: "individuality", color: "#0f182c" },
          { text: " — no two wearings unfold the same.", color: "#242424" },
          {
            text: "\nNotes of amber, cedar, and midnight florals linger like secrets, ",
            color: "#242424",
          },
          {
            text: "crafted for those who leave an impression without trying.",
            color: "#0f182c",
          },
          { text: "\nDiscover ", color: "#242424" },
          { text: "Venoire — your silent signature.", color: "#0f182c" },
        ]}
      />

      <FeaturedCollection />
      <FeaturedProduct />
      <MediaGallery />
      {/* <Why /> */}
    </main>
  );
}
