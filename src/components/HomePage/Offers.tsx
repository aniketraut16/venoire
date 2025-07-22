"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function Offers() {
    const cards = data.map((card) => (
        <Card key={card.src} card={card} />
    ));

    return (
        <div className="w-full h-full py-20">
            <h2 className="max-w-7xl text-center mx-auto text-xl md:text-5xl font-light text-gray-900 tracking-wide">
                Our Best Sellers on Offer
            </h2>
            <Carousel items={cards} />
        </div>
    );
}

const data = [
    {
        category: "Classic Crewneck T-Shirt",
        title: "40% off",
        src: "/best-sellers/Classic-Crewneck-T-Shirt.png",

    },
    {
        category: "Polo Shirt",
        title: "30% off",
        src: "/best-sellers/Polo-Shirt.png",

    },
    {
        category: " Oxford Button-Down Shirt",
        title: "30% off",
        src: "/best-sellers/Oxford-Button-Down-Shirt.png",

    },

    {
        category: "Flannel Shirt",
        title: "20% off",
        src: "/best-sellers/Flannel-Shirt.png",

    },
    {
        category: "Henley Shirt",
        title: "10% off",
        src: "/best-sellers/Henley-Shirt.png",

    },
    {
        category: "Camp Collar Shirt",
        title: "50% off",
        src: "/best-sellers/Camp-Collar-Shirt.png",

    },
];
