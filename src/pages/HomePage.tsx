'use client'
import Hero from "@/components/HomePage/Hero";
import Categories from "@/components/HomePage/Categories";
import { Offers } from "@/components/HomePage/Offers";
import Explore from "@/components/HomePage/Explore";

export default function HomePage() {
    return (
        <div>
            <Hero />
            <Categories />
            <Offers />
            <Explore />
        </div>
    )
}
