'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function DrunkenSailorPreloader() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip if already on drunken-sailor page (it loads its own assets)
    if (pathname?.includes('/drunken-sailor')) {
      return;
    }

    // Start preloading after 1 second so main page render/hydration is completely finished
    const timer = setTimeout(() => {
      console.log('[DrunkenSailorPreloader] 🚀 Starting background preloading of initial 10 frames...');

      // 1. Preload Lottie JSON definition (35 KB)
      fetch('/images/drunken-sailor/animations/DS_High_Angel_30.json').catch(() => {});

      // 2. Preload and decode first 10 can animation frames starting from frame 0 (image_89.webp down to image_80.webp)
      const frames = Array.from(
        { length: 10 },
        (_, i) => `/images/drunken-sailor/animations/images/image_${89 - i}.webp`
      );

      let loadedCount = 0;
      frames.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === frames.length) {
            console.log('[DrunkenSailorPreloader] ✅ All 10 initial frames (image_89..image_80) preloaded and cached!');
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

