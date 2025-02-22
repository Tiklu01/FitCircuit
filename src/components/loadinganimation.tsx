

"use client";

import { useEffect, useState } from "react";
import "animate.css";

export default function LoadingAnimation() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Disable scrolling when the component mounts
    document.body.style.overflow = "hidden";

    // Simulate a loading delay (e.g., 3 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Re-enable scrolling after the loading animation is done
      document.body.style.overflow = "visible";
    }, 3000);

    // Cleanup function to re-enable scrolling if the component unmounts
    return () => {
      document.body.style.overflow = "visible";
      clearTimeout(timer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50"
    >
      <div className="animate__animated animate__backInUp text-4xl font-bold">
      FitCircuit
      </div>
    </div>
  );
}