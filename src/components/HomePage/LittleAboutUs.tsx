import React from 'react'
import { TextReveal } from "@/components/ui/text-reveal"

export default function LittleAboutUs() {
  return (
    <section className="py-20">
        <div className="max-w-7xl flex gap-2 mx-auto px-4">
            <h2 className="mt-10 text-xl md:text-2xl font-normal text-gray-900 mb-4 tracking-wide border border-gray-900 rounded-full p-4 h-fit">About Us</h2>
            <TextReveal>J Stimler is a good quality fabric design and bulk production service for fashion retailers around the world.</TextReveal>
        </div>
    </section>
  )
}
