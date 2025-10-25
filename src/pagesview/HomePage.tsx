"use client";
import { useEffect, useState } from "react";
import Hero from "@/components/HomePage/Hero";
import Categories from "@/components/HomePage/Categories";
import  BrowseCollections  from "@/components/HomePage/BrowseCollections";
import Explore from "@/components/HomePage/Explore";
import FewProducts from "@/components/HomePage/FewProducts";
import Divider from "@/components/HomePage/divider";
import SignInRequest from "@/components/HomePage/SignInRequest";
import LittleAboutUs from "@/components/HomePage/LittleAboutUs";
import FewPerfumes from "@/components/HomePage/FewPerfumes";
import InstaReels from "@/components/HomePage/InstaReels";
import { getCategories } from "@/utils/homepage";
import { CategoryorCollection } from "@/types/homepage";


export default function HomePage() {

  const [categories, setCategories] = useState<CategoryorCollection[]>([]);
  const [collections, setCollections] = useState<CategoryorCollection[]>([]);

  useEffect(() => {
    const fetchCollectionsAndCategories = async () => {
      const { collections, categories } = await getCategories();
      setCollections(collections);
      setCategories(categories);
    };
    fetchCollectionsAndCategories();
  }, []);
  return (
    <div>
      <Hero />
      <LittleAboutUs />
      <Divider />
      <Categories categories={categories} />
      <BrowseCollections collections={collections} />
      <FewPerfumes />
      <FewProducts />
      <Explore />
      <SignInRequest />
      <InstaReels />
    </div>
  );
}
