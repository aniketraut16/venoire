const SUBCATEGORIES = [
  {
    id: 1,
    slug: "polo-shirts",
    title: "Polo Shirts",
    description:
      "Explore our collection of Polo Shirts, perfect for a smart-casual look.",
  },
  {
    id: 2,
    slug: "flannel-shirts",
    title: "Flannel Shirts",
    description:
      "Discover our range of Flannel Shirts, ideal for a cozy and stylish outfit.",
  },
  {
    id: 3,
    slug: "casual-shirts",
    title: "Casual Shirts",
    description:
      "Browse our Casual Shirts, designed for comfort and everyday wear.",
  },
  {
    id: 4,
    slug: "ceremonial-shirts",
    title: "Ceremonial Shirts",
    description:
      "Find the perfect Ceremonial Shirts for special occasions and formal events.",
  },
  {
    id: 5,
    slug: "crew-neck-t-shirts",
    title: "Crew Neck T-Shirts",
    description:
      "Check out our Crew Neck T-Shirts, offering a classic and versatile style.",
  },
  {
    id: 6,
    slug: "casual-blazers",
    title: "Casual Blazers",
    description:
      "Shop our Casual Blazers, perfect for adding a touch of elegance to any outfit.",
  },
  {
    id: 7,
    slug: "casual-shoes",
    title: "Casual Shoes",
    description:
      "Step into our Casual Shoes, combining comfort and style for everyday wear.",
  },
  {
    id: 8,
    slug: "ath-fit-jeans",
    title: "Ath Fit Jeans",
    description:
      "Explore our Ath Fit Jeans, designed for a comfortable and athletic fit.",
  },
  {
    id: 9,
    slug: "casual",
    title: "Casual",
    description:
      "Discover our Casual collection, perfect for relaxed and laid-back styles.",
  },
  {
    id: 10,
    slug: "formal",
    title: "Formal",
    description:
      "Browse our Formal collection, ideal for professional and elegant attire.",
  },
  {
    id: 11,
    slug: "party",
    title: "Party",
    description:
      "Find the perfect Party outfits, designed to make you stand out at any event.",
  },
  {
    id: 12,
    slug: "work",
    title: "Work",
    description:
      "Explore our Work collection, offering stylish and professional options for the office.",
  },
  {
    id: 13,
    slug: "outdoor",
    title: "Outdoor",
    description:
      "Check out our Outdoor collection, perfect for adventures and active lifestyles.",
  },
];

export const getAllSubcategories = () => {
  return SUBCATEGORIES;
};
export const getSubcategoryBySlug = (slug: string) => {
  return SUBCATEGORIES.find((subcategory) => subcategory.slug === slug);
};
