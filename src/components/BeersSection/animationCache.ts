/**
 * Animation Cache & Preloader for Mobile Beers Section.
 * Preloads Lottie JSON animations exclusively on mobile viewports (< 1024px)
 * to keep desktop lightweight and avoid network spikes during touch swipes.
 */

// Global in-memory cache for loaded animation JSON data
const cache = new Map<string, object>();
const loadingPromises = new Map<string, Promise<object | null>>();

export const BEER_ANIMATIONS: Record<string, string> = {
  drunkenSailor: '/images/beers/animations/DS_Direct_Angel_30_02.json',
  jackpot: '/images/beers/animations/JP_Direct_Angle_30_02.json',
  fireside: '/images/beers/animations/FS_Direct_30_02.json',
};

/**
 * Fetch and parse a single Lottie animation JSON into memory.
 */
export async function loadBeerAnimation(url: string): Promise<object | null> {
  if (cache.has(url)) {
    return cache.get(url)!;
  }

  if (loadingPromises.has(url)) {
    return loadingPromises.get(url)!;
  }

  const promise = (async () => {
    try {
      const response = await fetch(url, { priority: 'low' });
      if (!response.ok) {
        throw new Error(`Failed to load animation: ${response.statusText}`);
      }
      const data = await response.json();
      cache.set(url, data);
      return data;
    } catch (err) {
      console.warn(`[BeersPreloader] Could not load animation ${url}:`, err);
      return null;
    } finally {
      loadingPromises.delete(url);
    }
  })();

  loadingPromises.set(url, promise);
  return promise;
}

/**
 * Preload all beer animations sequentially when on a mobile viewport.
 */
export function preloadBeerAnimations(): void {
  if (typeof window === 'undefined') return;

  const isMobile = window.matchMedia('(max-width: 1023px)').matches;
  if (!isMobile) return;

  // Use requestIdleCallback if available, fallback to setTimeout
  const runPreload = () => {
    // 1. Prioritize Drunken Sailor (initial visible card)
    loadBeerAnimation(BEER_ANIMATIONS.drunkenSailor).then(() => {
      // 2. Preload Jackpot (second card)
      loadBeerAnimation(BEER_ANIMATIONS.jackpot).then(() => {
        // 3. Preload Fireside
        loadBeerAnimation(BEER_ANIMATIONS.fireside);
      });
    });
  };

  if ('requestIdleCallback' in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(runPreload);
  } else {
    setTimeout(runPreload, 300);
  }
}

