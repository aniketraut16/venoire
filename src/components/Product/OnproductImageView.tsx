import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    images: string[];
    onClose: () => void;
    initialIndex: number;
}

export default function OnproductImageView({ images, onClose, initialIndex }: Props) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handleThumbnailClick = (index: number) => {
        setCurrentIndex(index);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className='flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black/60 z-50'>
            <div className='flex max-w-5xl h-[90%] bg-white rounded-md overflow-hidden relative'>

                {/* Thumbnails */}
                <div className='w-20 overflow-y-auto bg-white py-4'>
                    <div className='flex flex-col gap-2 items-center'>
                        {images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                onClick={() => handleThumbnailClick(idx)}
                                className={`w-16 h-20 object-cover cursor-pointer border ${idx === currentIndex ? 'border-black' : 'border-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Main Image */}
                <div className='relative flex-1 flex items-center justify-center bg-white'>
                    <img
                        src={images[currentIndex]}
                        className='max-h-full max-w-full object-contain'
                        draggable={false}
                    />

                    {/* Prev */}
                    <button
                        onClick={handlePrev}
                        className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition'
                    >
                        <ChevronLeft />
                    </button>

                    {/* Next */}
                    <button
                        onClick={handleNext}
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition'
                    >
                        <ChevronRight />
                    </button>

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className='absolute top-2 right-2 bg-black/80 p-2 rounded-full hover:bg-black text-white transition'
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
