'use client';

import lottie from "lottie-web";
import { useEffect, useRef } from "react";

const ArrowLottie = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Load the animation
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        autoplay: false,
        loop: false,
        path: "/arrow-lottie2.json",
      });

      // Set up intersection observer
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && animationRef.current) {
            // Reset and play animation when in view
            animationRef.current.goToAndPlay(0);
          }
        },
        {
          threshold: 0.1, // Trigger when 10% of the element is visible
          rootMargin: '50px' // Start a bit earlier
        }
      );

      // Start observing
      observer.observe(containerRef.current);

      // Cleanup
      return () => {
        observer.disconnect();
        if (animationRef.current) {
          animationRef.current.destroy();
        }
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-40 w-full max-w-32 lg:scale-150 scale-125 opacity-100"
      style={{ visibility: 'visible' }}
    ></div>
  );
};

export default ArrowLottie;