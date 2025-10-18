"use client";
import React, { PropsWithChildren, useEffect, useRef } from "react";
import Lenis from "lenis";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";

const SmoothScrolling = ({ children }: PropsWithChildren) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const { isEnabled } = useSmoothScroll();

  // Initialize and control Lenis based on isEnabled
  useEffect(() => {
    if (!isEnabled) {
      console.log('SmoothScrolling: Smooth scroll disabled, skipping initialization')
      return;
    }

    console.log('SmoothScrolling: Initializing Lenis')
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.5,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      if (lenisRef.current) {
        lenisRef.current.raf(time);
      }
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      console.log('SmoothScrolling: Cleaning up Lenis')
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [isEnabled]);

  return <>{children}</>;
};

export default SmoothScrolling;
