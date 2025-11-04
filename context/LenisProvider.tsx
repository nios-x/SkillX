"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // scroll duration in seconds
      easing: (t) => 1 - Math.pow(1 - t, 3), // smooth cubic easing
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true,
      orientation: "vertical",
      gestureOrientation: "vertical",
      infinite: false,
    });

    // 👇 GSAP + Lenis sync loop
    const raf = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);

    // ✅ Force GPU acceleration globally
    document.documentElement.style.willChange = "transform";
    document.body.style.willChange = "transform";
    document.body.style.transform = "translateZ(0)";
    document.body.style.backfaceVisibility = "hidden";

    return () => {
      lenis.destroy();
      document.documentElement.style.willChange = "";
      document.body.style.willChange = "";
      document.body.style.transform = "";
      document.body.style.backfaceVisibility = "";
    };
  }, []);

  return <>{children}</>;
}
