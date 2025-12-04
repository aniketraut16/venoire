import React from 'react'
import { TextReveal } from "@/components/ui/text-reveal"

export default function LittleAboutUs() {
  return (
    <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-2 mx-auto px-4 sm:px-6 md:px-4">
            <h2 className="mt-0 md:mt-10 text-sm  md:text-xl lg:text-2xl font-normal text-gray-900 mb-2 md:mb-4 tracking-wide border border-gray-900 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:p-4 h-fit text-left md:text-left whitespace-nowrap w-fit ml-10 md:ml-0">Why Venoire</h2>
            <div className="w-full">
              <TextReveal>Curating the finest luxury fashion with exceptional quality & bespoke service.</TextReveal>
            </div>
        </div>
    </section>
  )
}
