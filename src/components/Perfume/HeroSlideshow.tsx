"use client";

import { useState, useEffect } from "react";

export default function HeroSlideshow() {
  const heroImages = [
    "/perfume/blue.png",
    "/perfume/black.png",
    "/perfume/white.png",
    "/perfume/off-white.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeout(() => {
        setPrevIndex(currentIndex);
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        setIsAnimating(true);
      }, 1500);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, heroImages.length]);

  const currentImage = heroImages[currentIndex];
  const previousImage = heroImages[prevIndex];
 
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Previous Image Layer - slides out */}
      <div className="absolute inset-0 flex items-center justify-center">
    <div 
          key={`${prevIndex}-prev-0`}
          className="h-full flex-1 hidden lg:block animate-[slideToBottom_1s_ease-out_forwards]"
      style={{
            backgroundImage: `url(${previousImage})`,
        backgroundSize: '500% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0% 0'
      }}
    >
        </div>
        <div 
          key={`${prevIndex}-prev-1`}
          className="h-full flex-1 animate-[slideToTop_1s_ease-out_forwards]"
          style={{
            backgroundImage: `url(${previousImage})`,
            backgroundSize: '500% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '25% 0'
          }}
        >
        </div>
        <div 
          key={`${prevIndex}-prev-2`}
          className="h-full flex-1 animate-[slideToBottom_1s_ease-out_forwards]"
          style={{
            backgroundImage: `url(${previousImage})`,
            backgroundSize: '500% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 0'
          }}
        >
        </div>
        <div 
          key={`${prevIndex}-prev-3`}
          className="h-full flex-1 hidden md:block animate-[slideToTop_1s_ease-out_forwards]"
          style={{
            backgroundImage: `url(${previousImage})`,
            backgroundSize: '500% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '75% 0'
          }}
        >
        </div>
        <div 
          key={`${prevIndex}-prev-4`}
          className="h-full flex-1 hidden lg:block animate-[slideToBottom_1s_ease-out_forwards]"
          style={{
            backgroundImage: `url(${previousImage})`,
            backgroundSize: '500% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '100% 0'
          }}
        >
        </div>
      </div>

      {/* Current Image Layer - slides in */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          key={`${currentIndex}-0`}
          className="h-full flex-1 hidden lg:block animate-[slideFromTop_1s_ease-out_forwards]"
          style={{
            backgroundImage: `url(${currentImage})`,
            backgroundSize: '500% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0% 0'
          }}
        >
    </div>
    <div 
          key={`${currentIndex}-1`}
      className="h-full flex-1 animate-[slideFromBottom_1s_ease-out_forwards]" 
      style={{
            backgroundImage: `url(${currentImage})`,
        backgroundSize: '500% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '25% 0'
      }}
    >
    </div>
    <div 
          key={`${currentIndex}-2`}
      className="h-full flex-1 animate-[slideFromTop_1s_ease-out_forwards]" 
      style={{
            backgroundImage: `url(${currentImage})`,
        backgroundSize: '500% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 0'
      }}
    >
    </div>
    <div 
          key={`${currentIndex}-3`}
          className="h-full flex-1 hidden md:block animate-[slideFromBottom_1s_ease-out_forwards]"
      style={{
            backgroundImage: `url(${currentImage})`,
        backgroundSize: '500% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '75% 0'
      }}
    >
    </div>
    <div 
          key={`${currentIndex}-4`}
          className="h-full flex-1 hidden lg:block animate-[slideFromTop_1s_ease-out_forwards]"
      style={{
            backgroundImage: `url(${currentImage})`,
        backgroundSize: '500% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '100% 0'
      }}
    >
        </div>
      </div>
    
    <style jsx>{`
      @keyframes slideFromTop {
        from {
          transform: translateY(-100%);
        }
        to {
          transform: translateY(0);
        }
      }
      @keyframes slideFromBottom {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
        @keyframes slideToTop {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-100%);
          }
        }
        @keyframes slideToBottom {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }
    `}</style>
   </div>
  );
}