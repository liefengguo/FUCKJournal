"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      const nextProgress = total > 0 ? (scrollTop / total) * 100 : 0;

      setProgress(nextProgress);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-black/5">
      <div
        className="h-full bg-black/70 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
