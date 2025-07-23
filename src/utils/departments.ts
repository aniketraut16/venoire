const DEPARTMENTS = [
  {
    id: 1,
    slug: "mens",
    title: "Mens",
    description:
      "Explore our extensive collection of men's clothing and accessories. Find the perfect fit for every occasion.",
  },
  {
    id: 2,
    slug: "womens",
    title: "Womens",
    description:
      "Discover the latest trends in women's fashion. Browse our collection to find your perfect style.",
  },
  {
    id: 3,
    slug: "kids",
    title: "Kids",
    description:
      "Find adorable and stylish clothing for kids. Perfect for playtime and special occasions.",
  },
  {
    id: 4,
    slug: "perfumes",
    title: "Perfumes",
    description:
      "Indulge in our exquisite range of perfumes. Find the perfect scent to match your personality.",
  },
  {
    id: 5,
    slug: "gifts",
    title: "Gifts",
    description:
      "Explore our curated selection of gifts. Perfect for every occasion and loved ones.",
  },
];

export const getAllDepartments = () => {
  return DEPARTMENTS;
};
export const getDepartmentBySlug = (slug: string) => {
  return DEPARTMENTS.find((department) => department.slug === slug);
};
