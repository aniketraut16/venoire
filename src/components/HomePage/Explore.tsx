import React from 'react'

export default function Explore() {
    return (
        <div className="flex justify-between max-w-7xl mx-auto mb-10">
            {/* Left Column - Text Content (2 parts) */}
            <div className="w-[45%] bg-white flex  px-8 py-12 h-[85vh]">
                <div className="max-w-md space-y-16">
                    <h1 className="text-4xl font-serif text-gray-900 leading-tight">
                        Elevate your everyday elegance with Venoire's timeless collection
                    </h1>
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Designed to dress the world in quiet confidence and curated luxury, our collection embodies effortless refinement for every occasion.
                    </p>
                    <button className="px-8 py-3 border border-gray-900 text-gray-900 uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-colors duration-300">
                        Shop Collection
                    </button>
                </div>
            </div>

            {/* Right Column - Image (3 parts) */}
            <div className="w-[55%] relative">
                <img
                    src="/model.jpg"
                    alt="Man in summer attire on a boat"
                    className="object-cover w-full h-[85vh]"
                />
            </div>
        </div>
    )
}
