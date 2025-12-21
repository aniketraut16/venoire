import { MetadataRoute } from "next";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const siteUrl = "https://itsvenoire.com";

function getValidDate(dateValue: any): Date {
  if (!dateValue) return new Date();
  
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) {
    return new Date();
  }
  
  return date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/aboutus",
    "/contact",
    "/auth",
    "/cart",
    "/checkout",
    "/collection",
    "/luxury",
    "/wishlist",
    "/perfume",
    "/perfume/collection",
    "/search",
    "/cookie-policy",
    "/privacy-policy",
    "/refund-policy",
    "/return-policy",
    "/shipping-policy",
    "/terms-and-conditions",
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const [productsRes, perfumesRes, categoriesRes] = await Promise.all([
      axios.get(`${baseUrl}/product/all`, { params: { page: 1, limit: 1000 } }),
      axios.get(`${baseUrl}/product/all-perfumes`),
      axios.get(`${baseUrl}/home/collections-and-categories`),
    ]);

    const products = productsRes.data?.data || [];
    const perfumes = perfumesRes.data?.data || [];
    const { collections = [], categories = [] } = categoriesRes.data?.data || {};

    const productUrls = products.map((product: any) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: getValidDate(product.updated_at || product.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const perfumeUrls = perfumes.map((perfume: any) => ({
      url: `${siteUrl}/perfume/${perfume.slug}`,
      lastModified: getValidDate(perfume.updated_at || perfume.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const categoryUrls = categories.map((category: any) => ({
      url: `${siteUrl}/c/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

    const collectionUrls = collections.map((collection: any) => ({
      url: `${siteUrl}/d/${collection.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

    dynamicRoutes = [
      ...productUrls,
      ...perfumeUrls,
      ...categoryUrls,
      ...collectionUrls,
    ];
  } catch (error) {
    console.error("Error fetching dynamic routes for sitemap:", error);
  }

  const staticSitemapEntries: MetadataRoute.Sitemap = staticRoutes.map(
    (route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
      priority: route === "" ? 1 : 0.7,
    })
  );

  return [...staticSitemapEntries, ...dynamicRoutes];
}

