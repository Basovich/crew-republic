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

    // Start preloading after 1 second so main page render/hydration is completely finished
    const timer = setTimeout(() => {
      console.log('[JackpotPreloader] 🚀 Starting background preloading of initial 10 frames...');

      // 1. Preload Lottie JSON definition
      fetch('/images/jackpot/animations/JP_High_Angle_30.json').catch(() => {});

      // 2. Preload and decode first 10 can animation frames (imgSeq_0.webp .. imgSeq_9.webp)
      const frames = Array.from(
        { length: 10 },
        (_, i) => `/images/jackpot/animations/images/imgSeq_${i}.webp`
      );

      let loadedCount = 0;
      frames.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === frames.length) {
            console.log('[JackpotPreloader] ✅ All 10 initial frames (imgSeq_0..imgSeq_9) preloaded and cached!');
          }
        };
        if (img.decode) {
          img.decode().catch(() => {});
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

