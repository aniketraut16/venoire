const CATEGORIES = [
  {
    id: 1,
    slug: "t-shirts",
    title: "T-Shirts",
    description:
      "Explore our wide range of T-Shirts, perfect for casual wear and available in various styles and colors.",
  },
  {
    id: 2,
    slug: "shirts",
    title: "Shirts",
    description:
      "Discover our collection of shirts, suitable for both formal and casual occasions, crafted from high-quality materials.",
  },
  {
    id: 3,
    slug: "blazers",
    title: "Blazers",
    description:
      "Browse our selection of blazers, ideal for adding a touch of sophistication to any outfit.",
  },
  {
    id: 4,
    slug: "dresses",
    title: "Dresses",
    description:
      "Find the perfect dress for any occasion, from elegant evening wear to casual day dresses.",
  },
  {
    id: 5,
    slug: "tops",
    title: "Tops",
    description:
      "Check out our variety of tops, including blouses, tees, and more, designed to complement any wardrobe.",
  },
  {
    id: 6,
    slug: "handbags",
    title: "Handbags",
    description:
      "Shop our collection of handbags, featuring stylish and functional designs for every need.",
  },
  {
    id: 7,
    slug: "shoes",
    title: "Shoes",
    description:
      "Step into style with our range of shoes, offering comfort and fashion for every occasion.",
  },
  {
    id: 8,
    slug: "jeans",
    title: "Jeans",
    description:
      "Explore our jeans collection, offering a variety of fits and washes to suit your style.",
  },
  {
    id: 9,
    slug: "trousers",
    title: "Trousers",
    description:
      "Discover our range of trousers, perfect for both work and leisure, available in various cuts and fabrics.",
  },
];

export const getAllCategories = () => {
  return CATEGORIES;
};
export const getCategoryBySlug = (slug: string) => {
  return CATEGORIES.find((category) => category.slug === slug);
};
