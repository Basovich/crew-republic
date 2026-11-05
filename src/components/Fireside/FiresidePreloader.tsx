'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function FiresidePreloader() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip if already on fireside page (it loads its own assets)
    if (pathname?.includes('/fireside')) {
      return;
    }

    // Start preloading after 1.5 seconds so main page render/hydration is completely finished
    const timer = setTimeout(() => {
      console.log('[FiresidePreloader] 🚀 Starting background preloading of initial 10 frames...');

      // 1. Preload Lottie JSON definition
      fetch('/images/fireside/animations/Fireside-glas.json').catch(() => {});

      // 2. Preload and decode first 10 glass animation frames starting from frame 0 (image_99.webp down to image_90.webp)
      const frames = Array.from(
        { length: 10 },
        (_, i) => `/images/fireside/animations/images/image_${99 - i}.webp`
      );

      let loadedCount = 0;
      frames.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === frames.length) {
            console.log('[FiresidePreloader] ✅ All 10 initial frames (image_99..image_90) preloaded and cached!');
          }
        };
        if (img.decode) {
          img.decode().catch(() => {});
        }
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

