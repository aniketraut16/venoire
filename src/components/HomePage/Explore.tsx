'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation';

export default function Explore() {
    const router = useRouter();
    return (
        <div className="flex flex-col-reverse md:flex-row justify-between max-w-7xl mx-auto mb-6 sm:mb-8 md:mb-10 mt-0 sm:mt-8 md:mt-10 overflow-hidden px-4 sm:px-6 md:px-0">
            {/* Left Column - Text Content */}
            <motion.div 
                className="w-full md:w-[45%] bg-white flex px-6 sm:px-8 py-8 sm:py-10 md:py-12 min-h-[400px] md:h-[85vh]"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <div className="max-w-md space-y-8 sm:space-y-12 md:space-y-16 flex flex-col justify-center">
                    <h1 className="text-display font-serif text-gray-900 leading-tight">
                        Elevate your everyday elegance with Venoire's timeless collection
                    </h1>
                    <p className="text-body text-gray-700 leading-relaxed">
                        Designed to dress the world in quiet confidence and curated luxury, our collection embodies effortless refinement for every occasion.
                    </p>
                    <button 
                    onClick={() => router.push('/collection')}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 border border-gray-900 text-gray-900 text-meta uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-colors duration-300 w-full sm:w-auto">
                        Shop Collection
                    </button>
                </div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div 
                className="w-full md:w-[55%] relative mt-6 md:mt-0"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <img
                    src="/model.jpg"
                    alt="Man in summer attire on a boat"
                    className="object-cover w-full h-[50vh] sm:h-[60vh] md:h-[85vh]"
                />
            </motion.div>
        </div>
    )
}
