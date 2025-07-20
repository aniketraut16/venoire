'use client'
import Hero from "@/components/HomePage/Hero";
import Categories from "@/components/HomePage/Categories";
import { Offers } from "@/components/HomePage/Offers";

export default function HomePage() {
    return (
        <div>
            <Hero />
            <Categories />
            <Offers />
        </div>
    )
}
