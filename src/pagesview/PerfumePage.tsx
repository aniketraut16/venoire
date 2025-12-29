import HeroSlideshow from "@/components/Perfume/HeroSlideshow";
import RichText from "@/components/Perfume/RichText";
import BestSellersPerfume from "@/components/Perfume/BestSellersPerfume";
import SignatureScents from "@/components/Perfume/SignatureScents";
import WhatMakesOurPerfumesUnique from "@/components/Perfume/WhatMakesOurPerfumesUnique";

export default function PerfumePage() {
  return (
    <main className="min-h-screen">
      <HeroSlideshow />
      <RichText
        titleParts={[
          { text: "VENOIRE", color: "#242424" },
          { text: "REDEFINES", color: "#ff5900" },
          { text: "MODERN LUXURY", color: "#242424", underline: true },
        ]}
        descriptionParts={[
          {
            text: "At Venoire, we believe fragrance is more than scent — ",
            color: "#242424",
          },
          { text: "it’s identity distilled into art.", color: "#ff5900" },
          {
            text: "\nEach creation is hand-blended in small ateliers, using ",
            color: "#242424",
          },
          { text: "meticulously sourced essences", color: "#ff5900" },
          { text: " from across the world.", color: "#242424" },
          { text: "\nEvery drop is an ode to ", color: "#242424" },
          { text: "individuality", color: "#ff5900" },
          { text: " — no two wearings unfold the same.", color: "#242424" },
          {
            text: "\nNotes of amber, cedar, and midnight florals linger like secrets, ",
            color: "#242424",
          },
          {
            text: "crafted for those who leave an impression without trying.",
            color: "#ff5900",
          },
          { text: "\nDiscover ", color: "#242424" },
          { text: "Venoire — your silent signature.", color: "#ff5900" },
        ]}
      />

      <BestSellersPerfume />
      <SignatureScents />
      <WhatMakesOurPerfumesUnique />
    </main>
  );
}
