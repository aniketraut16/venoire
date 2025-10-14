"use client";
import React, { PropsWithChildren } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

const SmoothScrolling = ({ children }: PropsWithChildren) => {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      {children as any}
    </ReactLenis>
  );
};

export default SmoothScrolling;

