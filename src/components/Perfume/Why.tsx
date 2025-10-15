'use client';
import React, { useState } from 'react';

interface WhyItem {
  id: number;
  title: string;
  description: string;
  position: 'top' | 'left' | 'right' | 'bottom';
}

const whyUsItems: WhyItem[] = [
  {
    id: 1,
    title: 'Long-Lasting',
    description: 'Perfumes that endure the heat without fading.',
    position: 'left',
  },
  {
    id: 2,
    title: 'Premium Quality',
    description: 'Crafted with the finest ingredients.',
    position: 'top',
  },
  {
    id: 3,
    title: 'Hand Made',
    description: 'Each perfume carefully handcrafted with love.',
    position: 'right',
  },
  {
    id: 4,
    title: 'Exclusive',
    description: 'Unique fragrances you won\'t find anywhere else.',
    position: 'bottom',
  },
];

export default function Why() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="w-full py-16 px-4 bg-[#FFF8F0]">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#D2691E]">
        WHY US?
      </h2>

      <div className="max-w-5xl mx-auto">
        {/* 3 Column Layout: 1-2-1 */}
        <div className="flex items-center justify-center gap-4">
          
          {/* Left Column - 1 Card (Long-Lasting) */}
          <div className="flex flex-col gap-4">
            <div
              className="relative"
              onMouseEnter={() => setHoveredId(1)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {hoveredId === 1 && (
                <>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-16 w-16 h-0.5 bg-gray-800 animate-line-grow-horizontal"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-80 w-60 text-right animate-fade-in">
                    <h3 className="text-lg font-semibold mb-1">{whyUsItems[0].title}</h3>
                    <p className="text-sm text-gray-700">{whyUsItems[0].description}</p>
                  </div>
                </>
              )}
              <div className="bg-white border-2 border-gray-800 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 w-40 h-40 flex items-center justify-center">
                <SprayBottleIcon />
              </div>
            </div>
          </div>

          {/* Center Column - 2 Cards (Top and Bottom) */}
          <div className="flex flex-col gap-4">
            {/* Top Card - Premium Quality */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredId(2)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {hoveredId === 2 && (
                <>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-56 w-56 h-0.5 bg-gray-800 animate-line-grow-horizontal-long"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-[470px] w-60 text-right animate-fade-in">
                    <h3 className="text-lg font-semibold mb-1">{whyUsItems[1].title}</h3>
                    <p className="text-sm text-gray-700">{whyUsItems[1].description}</p>
                  </div>
                </>
              )}
              <div className="bg-white border-2 border-gray-800 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 w-40 h-40 flex items-center justify-center">
                <PerfumeBottleIcon />
              </div>
            </div>

            {/* Bottom Card - Exclusive */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredId(4)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="bg-white border-2 border-gray-800 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 w-40 h-40 flex items-center justify-center">
                <CrownIcon />
              </div>
              {hoveredId === 4 && (
                <>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-56 w-56 h-0.5 bg-gray-800 animate-line-grow-horizontal-long-right"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-[470px] w-60 text-left animate-fade-in">
                    <h3 className="text-lg font-semibold mb-1">{whyUsItems[3].title}</h3>
                    <p className="text-sm text-gray-700">{whyUsItems[3].description}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - 1 Card (Hand Made) */}
          <div className="flex flex-col gap-4">
            <div
              className="relative"
              onMouseEnter={() => setHoveredId(3)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {hoveredId === 3 && (
                <>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-16 w-16 h-0.5 bg-gray-800 animate-line-grow-horizontal-right"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-80 w-60 text-left animate-fade-in">
                    <h3 className="text-lg font-semibold mb-1">{whyUsItems[2].title}</h3>
                    <p className="text-sm text-gray-700">{whyUsItems[2].description}</p>
                  </div>
                </>
              )}
              <div className="bg-white border-2 border-gray-800 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 w-40 h-40 flex items-center justify-center">
                <HandMadeIcon />
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes lineGrowVertical {
          from {
            height: 0;
          }
          to {
            height: 4rem;
          }
        }

        @keyframes lineGrowVerticalDown {
          from {
            height: 0;
          }
          to {
            height: 4rem;
          }
        }

        @keyframes lineGrowHorizontal {
          from {
            width: 0;
          }
          to {
            width: 4rem;
          }
        }

        @keyframes lineGrowHorizontalLong {
          from {
            width: 0;
          }
          to {
            width: 14rem;
          }
        }

        @keyframes lineGrowHorizontalRight {
          from {
            width: 0;
          }
          to {
            width: 4rem;
          }
        }

        @keyframes lineGrowHorizontalLongRight {
          from {
            width: 0;
          }
          to {
            width: 14rem;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }

        .animate-line-grow-vertical {
          animation: lineGrowVertical 0.3s ease-out;
        }

        .animate-line-grow-vertical-down {
          animation: lineGrowVerticalDown 0.3s ease-out;
        }

        .animate-line-grow-horizontal {
          animation: lineGrowHorizontal 0.3s ease-out;
        }

        .animate-line-grow-horizontal-long {
          animation: lineGrowHorizontalLong 0.3s ease-out;
        }

        .animate-line-grow-horizontal-right {
          animation: lineGrowHorizontalRight 0.3s ease-out;
        }

        .animate-line-grow-horizontal-long-right {
          animation: lineGrowHorizontalLongRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// SVG Icon Components
function SprayBottleIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="55" r="22" stroke="black" strokeWidth="2" fill="none"/>
      <rect x="45" y="25" width="10" height="15" rx="2" stroke="black" strokeWidth="2" fill="none"/>
      <circle cx="50" cy="55" r="8" stroke="black" strokeWidth="2" fill="none"/>
      <line x1="50" y1="48" x2="50" y2="62" stroke="black" strokeWidth="2"/>
      <line x1="43" y1="55" x2="57" y2="55" stroke="black" strokeWidth="2"/>
      <path d="M35 45 L30 40 M65 45 L70 40 M40 40 L35 35 M60 40 L65 35 M45 35 L42 28 M55 35 L58 28" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function CenterPerfumeIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="50" width="30" height="35" rx="3" stroke="black" strokeWidth="2.5" fill="white"/>
      <rect x="42" y="30" width="16" height="22" rx="2" stroke="black" strokeWidth="2.5" fill="white"/>
      <circle cx="50" cy="25" r="6" stroke="black" strokeWidth="2.5" fill="black"/>
      <rect x="48" y="20" width="4" height="8" fill="black"/>
      <line x1="38" y1="65" x2="48" y2="65" stroke="black" strokeWidth="2"/>
      <line x1="43" y1="60" x2="43" y2="70" stroke="black" strokeWidth="2"/>
      <path d="M40 28 L38 23 M60 28 L62 23" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 40 L28 36 M68 40 L72 36" stroke="black" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function HandMadeIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="55" width="60" height="25" rx="2" stroke="black" strokeWidth="2" fill="white"/>
      <text x="30" y="72" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="black">HAND</text>
      <text x="27" y="85" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="black">MADE</text>
      <path d="M40 45 L35 30 M45 45 L42 25 M50 45 L50 25 M55 45 L58 25 M60 45 L65 30" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      <path d="M35 30 C35 28 36 27 37 27 C38 27 39 28 39 30 M42 25 C42 23 43 22 44 22 C45 22 46 23 46 25 M50 25 C50 23 51 22 52 22 C53 22 54 23 54 25 M58 25 C58 23 59 22 60 22 C61 22 62 23 62 25 M65 30 C65 28 64 27 63 27 C62 27 61 28 61 30" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="35" cy="42" r="3" fill="black"/>
      <circle cx="45" cy="40" r="3" fill="black"/>
      <circle cx="55" cy="40" r="3" fill="black"/>
      <circle cx="65" cy="42" r="3" fill="black"/>
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 65 L30 40 L40 50 L50 35 L60 50 L70 40 L75 65 Z" stroke="black" strokeWidth="2.5" fill="none"/>
      <rect x="25" y="65" width="50" height="8" stroke="black" strokeWidth="2.5" fill="white"/>
      <text x="28" y="90" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="black">EXCLUSIVE</text>
      <circle cx="30" cy="40" r="3" fill="black"/>
      <circle cx="50" cy="35" r="3" fill="black"/>
      <circle cx="70" cy="40" r="3" fill="black"/>
      <circle cx="35" cy="58" r="2.5" fill="black"/>
      <circle cx="50" cy="55" r="2.5" fill="black"/>
      <circle cx="65" cy="58" r="2.5" fill="black"/>
    </svg>
  );
}

function PerfumeBottleIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="45" width="30" height="40" rx="3" stroke="black" strokeWidth="2.5" fill="white"/>
      <rect x="42" y="30" width="16" height="17" rx="2" stroke="black" strokeWidth="2.5" fill="white"/>
      <circle cx="50" cy="22" r="7" stroke="black" strokeWidth="2.5" fill="black"/>
      <rect x="47" y="16" width="6" height="10" fill="black"/>
      <line x1="38" y1="60" x2="48" y2="60" stroke="black" strokeWidth="2.5"/>
      <line x1="43" y1="55" x2="43" y2="65" stroke="black" strokeWidth="2.5"/>
      <path d="M30 35 L25 28 M70 35 L75 28 M32 28 L27 21 M68 28 L73 21" stroke="black" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
