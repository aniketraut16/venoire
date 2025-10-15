const perfumes: Perfume[] = [
  {
    id: "1",
    slug: "mystic-dawn",
    name: "Mystic Dawn",
    description:
      "A refreshing blend of citrus and delicate florals that captures the essence of early morning.",
    fragrance: "Citrus & Floral",
    coverImage: "https://cdn.shopify.com/s/files/1/0175/6875/9862/files/VanillaNoir-Cover.jpg?v=1756401634&width=700",
    images: [
      "/images/mystic-dawn-1.jpg",
      "/images/mystic-dawn-2.jpg",
      "/images/mystic-dawn-3.jpg",
    ],
    gender: "Unisex",
    price: [
      { quantity: 50, price: 2499, originalPrice: 3499 },
      { quantity: 100, price: 4299, originalPrice: 5999 },
    ],
    productDescription:
      "Mystic Dawn harnesses the vibrant energy of bergamot and lemon with calming jasmine and white lily notes, creating a perfect balance between freshness and elegance.",
    scentStory:
      "Inspired by serene sunrises over misty mountains, this fragrance embodies the tranquility and promise of a new day.",
    usageTips:
      "Apply to pulse points (wrists, neck, behind ears) after shower for maximum longevity. Ideal for daytime wear and spring/summer seasons.",
    ingredients:
      "Top notes: Bergamot, Lemon, Green Tea; Middle notes: Jasmine, White Lily, Neroli; Base notes: Musk, Amber, Sandalwood",
    brandAndManufacturerInfo:
      "Crafted by OOAK Perfumes, India. Manufactured at Unit 12, Fragrance Park, Navi Mumbai - 400701. Not tested on animals.",
  },
  {
    id: "2",
    slug: "velvet-oud",
    name: "Velvet Oud",
    description:
      "A luxurious oriental fragrance featuring rich oud wood and warm spices.",
    fragrance: "Woody Oriental",
    coverImage: "/images/velvet-oud.jpg",
    images: [
      "/images/velvet-oud-1.jpg",
      "/images/velvet-oud-2.jpg",
      "/images/velvet-oud-3.jpg",
    ],
    gender: "Unisex",
    price: [
      { quantity: 50, price: 3999, originalPrice: 5499 },
      { quantity: 100, price: 6999, originalPrice: 9999 },
    ],
    productDescription:
      "An opulent blend of premium agarwood (oud) with saffron, amber, and patchouli creates a deeply sensual and mysterious fragrance.",
    scentStory:
      "Inspired by the ancient spice routes of Arabia, Velvet Oud tells the story of luxury, tradition, and timeless elegance.",
    usageTips:
      "Best for evening wear and special occasions. Apply sparingly as the scent is concentrated. Perfect for fall and winter seasons.",
    ingredients:
      "Top notes: Saffron, Cardamom; Middle notes: Oud Wood, Rose, Patchouli; Base notes: Amber, Musk, Vanilla",
    brandAndManufacturerInfo:
      "Premium Collection by OOAK Perfumes. Contains sustainably sourced oud from Southeast Asia. Eau de Parfum concentration (15-20%).",
  },
  {
    id: "3",
    slug: "rose-elegance",
    name: "Rose Elegance",
    description:
      "A sophisticated floral fragrance centered around the timeless beauty of damascus rose.",
    fragrance: "Floral",
    coverImage: "/images/rose-elegance.jpg",
    images: ["/images/rose-elegance-1.jpg", "/images/rose-elegance-2.jpg"],
    gender: "Women",
    price: [
      { quantity: 50, price: 2799, originalPrice: 3999 },
      { quantity: 100, price: 4799, originalPrice: 6499 },
    ],
    productDescription:
      "A delicate bouquet of Damascus rose, peony, and iris creates a romantic and feminine fragrance that exudes grace and sophistication.",
    scentStory:
      "Inspired by blooming rose gardens in full spring, this perfume captures the pure elegance and romance of fresh roses.",
    usageTips:
      "Perfect for romantic occasions, weddings, and daytime events. Spray on hair and clothing for extended wear.",
    ingredients:
      "Top notes: Pink Pepper, Mandarin; Middle notes: Damascus Rose, Peony, Iris; Base notes: White Musk, Cedarwood, Powdery Notes",
    brandAndManufacturerInfo:
      "OOAK Perfumes Women's Collection. Contains natural rose extract from Kannauj, India. Dermatologically tested.",
  },
  {
    id: "4",
    slug: "ocean-breeze",
    name: "Ocean Breeze",
    description:
      "A fresh aquatic scent that evokes the invigorating feeling of seaside mornings.",
    fragrance: "Fresh Aquatic",
    coverImage: "/images/ocean-breeze.jpg",
    images: [
      "/images/ocean-breeze-1.jpg",
      "/images/ocean-breeze-2.jpg",
      "/images/ocean-breeze-3.jpg",
    ],
    gender: "Men",
    price: [
      { quantity: 50, price: 2299, originalPrice: 3299 },
      { quantity: 100, price: 3999, originalPrice: 5499 },
    ],
    productDescription:
      "Crisp marine notes blended with mint, lavender and ambergris create a refreshing and masculine fragrance perfect for the modern man.",
    scentStory:
      "Capturing the essence of ocean waves and coastal winds, this fragrance embodies freedom, adventure, and vitality.",
    usageTips:
      "Ideal for gym, office, and casual wear. Reapply every 4-6 hours. Best suited for summer and active lifestyles.",
    ingredients:
      "Top notes: Sea Salt, Mint, Grapefruit; Middle notes: Lavender, Marine Notes, Geranium; Base notes: Ambergris, Driftwood, Musk",
    brandAndManufacturerInfo:
      "OOAK Men's Sport Collection. Alcohol-free formula. Made in India with imported French fragrance oils.",
  },
  {
    id: "5",
    slug: "golden-saffron",
    name: "Golden Saffron",
    description:
      "A warm and festive fragrance featuring precious saffron and rich oriental spices.",
    fragrance: "Spicy Oriental",
    coverImage: "/images/golden-saffron.jpg",
    images: ["/images/golden-saffron-1.jpg", "/images/golden-saffron-2.jpg"],
    gender: "Unisex",
    price: [
      { quantity: 50, price: 3499, originalPrice: 4999 },
      { quantity: 100, price: 5999, originalPrice: 7999 },
    ],
    productDescription:
      "Luxurious saffron threads combined with cardamom, cinnamon, and sandalwood create a warm, celebratory fragrance perfect for festive occasions.",
    scentStory:
      "Inspired by Diwali celebrations and Indian festive traditions, Golden Saffron embodies warmth, prosperity, and joy.",
    usageTips:
      "Perfect for Diwali, weddings, and festive gatherings. Apply to traditional clothing for enhanced experience.",
    ingredients:
      "Top notes: Saffron, Cardamom, Orange Zest; Middle notes: Cinnamon, Clove, Rose; Base notes: Sandalwood, Amber, Vanilla, Tonka Bean",
    brandAndManufacturerInfo:
      "OOAK Festive Collection. Contains authentic Kashmiri saffron extract. Limited edition for festival season.",
  },
  {
    id: "6",
    slug: "jasmine-nights",
    name: "Jasmine Nights",
    description:
      "An enchanting evening fragrance dominated by night-blooming jasmine.",
    fragrance: "Floral Oriental",
    coverImage: "/images/jasmine-nights.jpg",
    images: ["/images/jasmine-nights-1.jpg", "/images/jasmine-nights-2.jpg"],
    gender: "Women",
    price: [
      { quantity: 50, price: 2899, originalPrice: 4199 },
      { quantity: 100, price: 4999, originalPrice: 6999 },
    ],
    productDescription:
      "Intoxicating night jasmine blended with vanilla, benzoin, and musk creates a sensual and mysterious evening fragrance.",
    scentStory:
      "Inspired by moonlit gardens where jasmine blooms release their most intense fragrance after sunset.",
    usageTips:
      "Best for evening events, dates, and special occasions. Long-lasting formula requires minimal application.",
    ingredients:
      "Top notes: Mandarin, Black Currant; Middle notes: Sambac Jasmine, Tuberose, Orange Blossom; Base notes: Vanilla, Benzoin, White Musk",
    brandAndManufacturerInfo:
      "OOAK Perfumes Evening Collection. Contains natural jasmine absolute. High concentration Eau de Parfum.",
  },
  {
    id: "7",
    slug: "cedarwood-noir",
    name: "Cedarwood Noir",
    description:
      "A bold woody fragrance with dark cedar and tobacco leaf notes.",
    fragrance: "Woody Aromatic",
    coverImage: "/images/cedarwood-noir.jpg",
    images: [
      "/images/cedarwood-noir-1.jpg",
      "/images/cedarwood-noir-2.jpg",
      "/images/cedarwood-noir-3.jpg",
    ],
    gender: "Men",
    price: [
      { quantity: 50, price: 2999, originalPrice: 4299 },
      { quantity: 100, price: 4999, originalPrice: 6999 },
    ],
    productDescription:
      "Powerful cedarwood combined with leather, tobacco, and vetiver creates a sophisticated masculine scent for the confident man.",
    scentStory:
      "Inspired by gentleman's clubs and fine whiskey lounges, this fragrance embodies sophistication and masculine strength.",
    usageTips:
      "Perfect for business meetings, formal events, and evening wear. Apply to chest and wrists for maximum projection.",
    ingredients:
      "Top notes: Bergamot, Black Pepper, Juniper; Middle notes: Cedar, Tobacco Leaf, Leather; Base notes: Vetiver, Patchouli, Oakmoss",
    brandAndManufacturerInfo:
      "OOAK Men's Signature Collection. Contains Virginian cedarwood oil. Long-lasting 8-10 hour performance.",
  },
  {
    id: "8",
    slug: "mango-bliss",
    name: "Mango Bliss",
    description:
      "A tropical fruity fragrance celebrating India's king of fruits.",
    fragrance: "Fruity Floral",
    coverImage: "/images/mango-bliss.jpg",
    images: ["/images/mango-bliss-1.jpg", "/images/mango-bliss-2.jpg"],
    gender: "Unisex",
    price: [
      { quantity: 50, price: 1999, originalPrice: 2999 },
      { quantity: 100, price: 3499, originalPrice: 4999 },
    ],
    productDescription:
      "Sweet Alphonso mango combined with passion fruit, coconut, and white flowers creates a playful tropical escape.",
    scentStory:
      "Inspired by summer mango orchards and tropical Indian beaches, this fragrance is pure sunshine in a bottle.",
    usageTips:
      "Perfect for casual daywear and summer outings. Layer with body lotion for enhanced longevity.",
    ingredients:
      "Top notes: Mango, Passion Fruit, Coconut Water; Middle notes: Frangipani, Ylang-Ylang, Tiare Flower; Base notes: Vanilla, Coconut, Solar Musk",
    brandAndManufacturerInfo:
      "OOAK Summer Collection. Vegan formula. Contains natural mango essence from Ratnagiri.",
  },
  {
    id: "9",
    slug: "sandalwood-serenity",
    name: "Sandalwood Serenity",
    description:
      "A calming woody fragrance featuring sacred Indian sandalwood.",
    fragrance: "Woody Oriental",
    coverImage: "/images/sandalwood-serenity.jpg",
    images: [
      "/images/sandalwood-serenity-1.jpg",
      "/images/sandalwood-serenity-2.jpg",
    ],
    gender: "Unisex",
    price: [
      { quantity: 50, price: 3299, originalPrice: 4699 },
      { quantity: 100, price: 5699, originalPrice: 7999 },
    ],
    productDescription:
      "Pure Mysore sandalwood blended with incense, cardamom, and creamy notes creates a meditative and spiritual fragrance.",
    scentStory:
      "Inspired by ancient temples and meditation spaces, this fragrance brings inner peace and tranquility.",
    usageTips:
      "Ideal for yoga, meditation, and spiritual practices. Can be used in prayer rooms as a natural fragrance.",
    ingredients:
      "Top notes: Cardamom, Bergamot, Saffron; Middle notes: Mysore Sandalwood, Frankincense, Cedar; Base notes: Sandalwood, Vetiver, Musk, Vanilla",
    brandAndManufacturerInfo:
      "OOAK Spiritual Collection. Contains certified Mysore sandalwood oil. Sustainable and ethical sourcing.",
  },
  {
    id: "10",
    slug: "lavender-dreams",
    name: "Lavender Dreams",
    description:
      "A soothing aromatic blend centered around pure lavender fields.",
    fragrance: "Aromatic Fougere",
    coverImage: "/images/lavender-dreams.jpg",
    images: ["/images/lavender-dreams-1.jpg", "/images/lavender-dreams-2.jpg"],
    gender: "Unisex",
    price: [
      { quantity: 50, price: 2199, originalPrice: 3199 },
      { quantity: 100, price: 3799, originalPrice: 5299 },
    ],
    productDescription:
      "Fresh lavender combined with chamomile, sage, and soft woods creates a calming and stress-relieving fragrance.",
    scentStory:
      "Inspired by Provence lavender fields at dusk, this scent promotes relaxation and peaceful sleep.",
    usageTips:
      "Spray on pillows before bedtime for better sleep. Perfect for work-from-home and stress relief.",
    ingredients:
      "Top notes: Lavender, Chamomile, Mint; Middle notes: Sage, Rosemary, Geranium; Base notes: Cedarwood, Vetiver, Tonka Bean",
    brandAndManufacturerInfo:
      "OOAK Wellness Collection. Contains therapeutic-grade lavender oil. Aromatherapy benefits validated.",
  },
  {
    id: "11",
    slug: "amber-royale",
    name: "Amber Royale",
    description:
      "A regal oriental fragrance with rich amber and precious resins.",
    fragrance: "Oriental Amber",
    coverImage: "/images/amber-royale.jpg",
    images: [
      "/images/amber-royale-1.jpg",
      "/images/amber-royale-2.jpg",
      "/images/amber-royale-3.jpg",
    ],
    gender: "Unisex",
    price: [
      { quantity: 50, price: 3799, originalPrice: 5299 },
      { quantity: 100, price: 6499, originalPrice: 8999 },
    ],
    productDescription:
      "Luxurious amber accord blended with myrrh, labdanum, and vanilla creates an opulent and warm fragrance fit for royalty.",
    scentStory:
      "Inspired by Indian maharajas and royal courts, Amber Royale embodies luxury, heritage, and timeless elegance.",
    usageTips:
      "Perfect for weddings, festive occasions, and grand celebrations. Pairs beautifully with traditional Indian attire.",
    ingredients:
      "Top notes: Bergamot, Cinnamon, Clove; Middle notes: Myrrh, Labdanum, Jasmine; Base notes: Amber, Vanilla, Patchouli, Benzoin",
    brandAndManufacturerInfo:
      "OOAK Royal Collection. Premium Eau de Parfum. Presented in handcrafted glass bottle with gold accents.",
  },
  {
    id: "12",
    slug: "citrus-burst",
    name: "Citrus Burst",
    description: "An energizing citrus explosion perfect for vibrant mornings.",
    fragrance: "Citrus Aromatic",
    coverImage: "/images/citrus-burst.jpg",
    images: ["/images/citrus-burst-1.jpg", "/images/citrus-burst-2.jpg"],
    gender: "Unisex",
    price: [
      { quantity: 50, price: 1899, originalPrice: 2799 },
      { quantity: 100, price: 3299, originalPrice: 4599 },
    ],
    productDescription:
      "A zesty blend of lemon, orange, grapefruit, and lime creates an uplifting and refreshing fragrance that energizes the senses.",
    scentStory:
      "Inspired by fresh citrus groves and summer sunshine, this fragrance is an instant mood booster.",
    usageTips:
      "Perfect for morning showers and gym sessions. Reapply throughout the day for continuous freshness.",
    ingredients:
      "Top notes: Lemon, Grapefruit, Lime, Sweet Orange; Middle notes: Neroli, Petit Grain, Green Tea; Base notes: Vetiver, White Musk",
    brandAndManufacturerInfo:
      "OOAK Energy Collection. Light Eau de Toilette concentration. Suitable for all ages including teenagers.",
  },
  {
    id: "13",
    slug: "vanilla-temptation",
    name: "Vanilla Temptation",
    description: "A gourmand delight featuring creamy Madagascar vanilla.",
    fragrance: "Gourmand Sweet",
    coverImage: "/images/vanilla-temptation.jpg",
    images: [
      "/images/vanilla-temptation-1.jpg",
      "/images/vanilla-temptation-2.jpg",
    ],
    gender: "Women",
    price: [
      { quantity: 50, price: 2599, originalPrice: 3699 },
      { quantity: 100, price: 4399, originalPrice: 6199 },
    ],
    productDescription:
      "Rich Madagascar vanilla combined with caramel, praline, and whipped cream creates an irresistibly sweet and cozy fragrance.",
    scentStory:
      "Inspired by decadent desserts and warm bakeries, this fragrance is comfort in a bottle.",
    usageTips:
      "Perfect for cozy winter days and casual outings. Layer with vanilla body lotion for enhanced sweetness.",
    ingredients:
      "Top notes: Red Berries, Sugar; Middle notes: Vanilla Orchid, Caramel, Almond; Base notes: Madagascar Vanilla, Praline, Tonka Bean, White Musk",
    brandAndManufacturerInfo:
      "OOAK Gourmand Collection. Contains natural vanilla extract. Sweet and long-lasting formula.",
  },
  {
    id: "14",
    slug: "leather-spice",
    name: "Leather & Spice",
    description:
      "A bold masculine fragrance with premium leather and warm spices.",
    fragrance: "Leather Spicy",
    coverImage: "/images/leather-spice.jpg",
    images: [
      "/images/leather-spice-1.jpg",
      "/images/leather-spice-2.jpg",
      "/images/leather-spice-3.jpg",
    ],
    gender: "Men",
    price: [
      { quantity: 50, price: 3199, originalPrice: 4599 },
      { quantity: 100, price: 5499, originalPrice: 7699 },
    ],
    productDescription:
      "Refined leather accord combined with black pepper, nutmeg, and amber creates a powerful and masculine fragrance.",
    scentStory:
      "Inspired by luxury automobiles and Italian leather goods, this fragrance exudes confidence and sophistication.",
    usageTips:
      "Best for business meetings, formal events, and evening wear. Apply to clothing for extended longevity.",
    ingredients:
      "Top notes: Black Pepper, Pink Pepper, Cardamom; Middle notes: Leather, Nutmeg, Iris; Base notes: Amber, Patchouli, Vetiver, Tonka Bean",
    brandAndManufacturerInfo:
      "OOAK Men's Premium Collection. High concentration Eau de Parfum. 10-12 hour wear time.",
  },
  {
    id: "15",
    slug: "tuberose-elegance",
    name: "Tuberose Elegance",
    description:
      "An intoxicating white floral fragrance featuring creamy tuberose.",
    fragrance: "White Floral",
    coverImage: "/images/tuberose-elegance.jpg",
    images: [
      "/images/tuberose-elegance-1.jpg",
      "/images/tuberose-elegance-2.jpg",
    ],
    gender: "Women",
    price: [
      { quantity: 50, price: 3099, originalPrice: 4499 },
      { quantity: 100, price: 5299, originalPrice: 7399 },
    ],
    productDescription:
      "Opulent tuberose combined with gardenia, orange blossom, and creamy notes creates a sensual and sophisticated white floral bouquet.",
    scentStory:
      "Inspired by Indian rajnigandha (tuberose) worn in traditional jasmine garlands, modernized for contemporary elegance.",
    usageTips:
      "Perfect for weddings, romantic dinners, and special occasions. A little goes a long way with this concentrated formula.",
    ingredients:
      "Top notes: Green Leaves, Mandarin; Middle notes: Tuberose, Gardenia, Orange Blossom; Base notes: Coconut, Sandalwood, Musk",
    brandAndManufacturerInfo:
      "OOAK White Floral Collection. Contains natural tuberose absolute. Luxurious and long-lasting.",
  },
  {
    id: "16",
    slug: "patchouli-earth",
    name: "Patchouli Earth",
    description: "A deep earthy fragrance with rich patchouli and dark woods.",
    fragrance: "Woody Earthy",
    coverImage: "/images/patchouli-earth.jpg",
    images: ["/images/patchouli-earth-1.jpg", "/images/patchouli-earth-2.jpg"],
    gender: "Unisex",
    price: [
      { quantity: 50, price: 2799, originalPrice: 3999 },
      { quantity: 100, price: 4799, originalPrice: 6699 },
    ],
    productDescription:
      "Dark patchouli blended with oakmoss, vetiver, and earthy notes creates a grounding and mysterious fragrance.",
    scentStory:
      "Inspired by dense forests and ancient earth, this fragrance connects you with nature's raw beauty.",
    usageTips:
      "Ideal for autumn and winter seasons. Perfect for both day and evening wear.",
    ingredients:
      "Top notes: Bergamot, Clary Sage; Middle notes: Patchouli, Geranium, Rose; Base notes: Oakmoss, Vetiver, Musk, Cedarwood",
    brandAndManufacturerInfo:
      "OOAK Earth Collection. Contains Indonesian patchouli oil. Eco-friendly and sustainable production.",
  },
  {
    id: "17",
    slug: "cherry-blossom",
    name: "Cherry Blossom",
    description:
      "A delicate floral fragrance inspired by Japanese sakura flowers.",
    fragrance: "Soft Floral Fruity",
    coverImage: "/images/cherry-blossom.jpg",
    images: ["/images/cherry-blossom-1.jpg", "/images/cherry-blossom-2.jpg"],
    gender: "Women",
    price: [
      { quantity: 50, price: 2399, originalPrice: 3499 },
      { quantity: 100, price: 4199, originalPrice: 5899 },
    ],
    productDescription:
      "Soft cherry blossom petals combined with red berries, magnolia, and rice powder creates a delicate and feminine spring fragrance.",
    scentStory:
      "Inspired by Japanese cherry blossom festivals, capturing the fleeting beauty of sakura season.",
    usageTips:
      "Perfect for spring and everyday wear. Light and office-friendly fragrance suitable for all occasions.",
    ingredients:
      "Top notes: Cherry, Red Berries, Mandarin; Middle notes: Cherry Blossom, Magnolia, Peony; Base notes: Rice Powder, Musk, Sandalwood",
    brandAndManufacturerInfo:
      "OOAK Spring Collection. Light and airy Eau de Toilette. Gentle formula suitable for sensitive skin.",
  },
  {
    id: "18",
    slug: "monsoon-mist",
    name: "Monsoon Mist",
    description:
      "A unique fragrance capturing the essence of Indian monsoon rains.",
    fragrance: "Fresh Earthy",
    coverImage: "/images/monsoon-mist.jpg",
    images: ["/images/monsoon-mist-1.jpg", "/images/monsoon-mist-2.jpg"],
    gender: "Unisex",
    price: [
      { quantity: 50, price: 2499, originalPrice: 3599 },
      { quantity: 100, price: 4299, originalPrice: 5999 },
    ],
    productDescription:
      "Petrichor (wet earth) combined with aquatic notes, green leaves, and subtle florals recreates the magical smell of first monsoon rains.",
    scentStory:
      "Inspired by the Indian monsoon season and the distinctive smell of rain hitting dry earth.",
    usageTips:
      "Perfect for monsoon season and nature lovers. Evokes nostalgia and peaceful rainy day feelings.",
    ingredients:
      "Top notes: Aquatic Notes, Green Leaves, Cucumber; Middle notes: Petrichor Accord, Lotus, Water Lily; Base notes: Vetiver, Cedarwood, Musk",
    brandAndManufacturerInfo:
      "OOAK Monsoon Collection. Unique Indian-inspired fragrance. Limited seasonal edition.",
  },
];

const perfumeCollections: PerfumeCollection[] = [
  {
    id: "c0",
    name: "All Perfumes",
    description: "A collection of all perfumes",
    coverImage: "/images/festive-collection.jpg",
    perfumes: [
      perfumes[0], // Mystic Dawn
      perfumes[1], // Velvet Oud
      perfumes[2], // Rose Elegance
      perfumes[3], // Ocean Breeze
      perfumes[4], // Golden Saffron
      perfumes[5], // Jasmine Nights
      perfumes[6], // Cedarwood Noir
      perfumes[7], // Mango Bliss
      perfumes[8], // Sandalwood Serenity
      perfumes[9], // Lavender Dreams
      perfumes[10], // Amber Royale
      perfumes[11], // Citrus Burst
      perfumes[12], // Vanilla Temptation
      perfumes[13], // Leather & Spice
      perfumes[14], // Tuberose Elegance
      perfumes[15], // Patchouli Earth
      perfumes[16], // Cherry Blossom
      perfumes[17], // Monsoon Mist
    ],
  },
  {
    id: "c1",
    name: "Summer Vibes",
    description:
      "Fresh, light, and energizing fragrances perfect for hot Indian summers and tropical weather.",
    coverImage: "/images/summer-collection.jpg",
    perfumes: [
      perfumes[0], // Mystic Dawn
      perfumes[3], // Ocean Breeze
      perfumes[7], // Mango Bliss
      perfumes[11], // Citrus Burst
      perfumes[17], // Monsoon Mist
    ].filter(Boolean), // Filter out any undefined values
  },
  {
    id: "c2",
    name: "Winter Warmth",
    description:
      "Cozy, warm, and comforting fragrances ideal for cooler months featuring woody, spicy, and gourmand notes.",
    coverImage: "/images/winter-collection.jpg",
    perfumes: [
      perfumes[1], // Velvet Oud
      perfumes[6], // Cedarwood Noir
      perfumes[12], // Vanilla Temptation
      perfumes[13], // Leather & Spice
      perfumes[15], // Patchouli Earth
    ].filter(Boolean),
  },
  {
    id: "c3",
    name: "Floral Garden",
    description:
      "An exquisite collection of floral fragrances from delicate blossoms to intense white florals.",
    coverImage: "/images/floral-collection.jpg",
    perfumes: [
      perfumes[2], // Rose Elegance
      perfumes[5], // Jasmine Nights
      perfumes[14], // Tuberose Elegance
      perfumes[16], // Cherry Blossom
      perfumes[0], // Mystic Dawn
    ].filter(Boolean),
  },
  {
    id: "c4",
    name: "Luxury Premium",
    description:
      "Our finest and most sophisticated fragrances featuring rare ingredients and complex compositions.",
    coverImage: "/images/luxury-collection.jpg",
    perfumes: [
      perfumes[1], // Velvet Oud
      perfumes[10], // Amber Royale
      perfumes[14], // Tuberose Elegance
      perfumes[13], // Leather & Spice
      perfumes[8], // Sandalwood Serenity
      perfumes[4], // Golden Saffron
    ].filter(Boolean),
  },
];

// Helper function to get perfumes by collection
function getPerfumesByCollection(collectionId: string) {
  const collection = perfumeCollections.find((c) => c.id === collectionId);
  if (!collection) return null;

  return {
    ...collection,
    perfumes: collection.perfumes,
  };
}

function getAllCollections() {
  return perfumeCollections.map((collection) => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    coverImage: collection.coverImage,
  }));
}

function perfumeslugcdn() {
  return perfumes.map((perfume) => ({
    id: perfume.id,
    slug: perfume.slug,
  }));
}

// Export all data
export { getPerfumesByCollection, getAllCollections, perfumeslugcdn };
