"use client";
import Hero from "@/components/HomePage/Hero";
import Categories from "@/components/HomePage/Categories";
import { Offers } from "@/components/HomePage/Offers";
import Explore from "@/components/HomePage/Explore";
import FewProducts from "@/components/HomePage/FewProducts";
import Divider from "@/components/HomePage/divider";
import SignInRequest from "@/components/HomePage/SignInRequest";
import LittleAboutUs from "@/components/HomePage/LittleAboutUs";
import FewPerfumes from "@/components/HomePage/FewPerfumes";
import InstaReels from "@/components/HomePage/InstaReels";
export default function HomePage() {
  return (
    <div>
      <Hero />
      <LittleAboutUs />
      <Divider />
      <Categories />
      <Offers />
      <FewPerfumes />
      <FewProducts />
      <Explore />
      <SignInRequest />
      <InstaReels />
    </div>
  );
}
