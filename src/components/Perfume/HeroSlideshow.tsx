"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function HeroSlideshow() {
  const [animationComplete, setAnimationComplete] = useState(false);

  return (
    <section className="relative h-[500px] md:h-[750px] overflow-hidden bg-[#fcf9ee]">
      <div className="relative w-full h-full">
        <AnimatePresence>
          {!animationComplete ? (
            <motion.div
              key="split-images"
              className="absolute inset-0 z-[0] flex"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onAnimationComplete={() => {
                  setTimeout(() => setAnimationComplete(true), 200);
                }}
                className="w-1/2 h-full overflow-hidden"
              >
                <img
                  src="/perfume/perfume-bg.jpg"
                  alt="Hero Left"
                  className="object-cover w-[200%] h-full object-left"
                />
              </motion.div>

              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-1/2 h-full overflow-hidden"
              >
                <img
                  src="/perfume/perfume-bg.jpg"
                  alt="Hero Right"
                  className="object-cover w-[200%] h-full object-right"
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="full-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-[0]"
            >
              <img
                src="/perfume/perfume-bg.jpg"
                alt="Hero Background"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/20 w-full h-full z-[1] pointer-events-none" />

        <div className="absolute inset-0 flex items-center justify-center z-[2]">
          <div className="text-center px-6 md:px-8 max-w-[550px]">
            <h1 className="text-[2rem] md:text-[4rem] leading-tight font-heading text-white mb-6">
              DISCOVER YOUR SIGNATURE SCENT
            </h1>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center z-30">
          <div className="w-[30px] h-[46px] border-2 border-white/60 rounded-[30px] mx-auto mb-2">
            <svg height="30" width="10" className="mx-auto">
              <circle
                className="animate-scroll-down"
                cx="5"
                cy="15"
                r="2"
                fill="rgba(255, 255, 255, 0.6)"
              />
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-down {
          0% {
            opacity: 0;
            transform: translateY(-8px);
          }
          50% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(8px);
          }
        }
        .animate-scroll-down {
          animation: scroll-down 1.5s ease infinite;
        }
      `}</style>
    </section>
  );
}