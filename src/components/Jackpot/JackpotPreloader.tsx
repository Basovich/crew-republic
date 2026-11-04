'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function JackpotPreloader() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip if already on jackpot page (it loads its own assets)
    if (pathname?.includes('/jackpot')) {
      return;
    }

    // Start preloading after 1.5s so main page render is completely finished
    const timer = setTimeout(() => {
      // 1. Preload Lottie JSON definition
      fetch('/images/jackpot/animations/JP_High_Angle_30.json').catch(() => {});

      // 2. Preload and decode first 10 can animation frames (imgSeq_0.webp .. imgSeq_9.webp)
      const frames = Array.from(
        { length: 10 },
        (_, i) => `/images/jackpot/animations/images/imgSeq_${i}.webp`
      );

      frames.forEach((src) => {
        const img = new Image();
        img.src = src;
        if (img.decode) {
          img.decode().catch(() => {});
        }
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

