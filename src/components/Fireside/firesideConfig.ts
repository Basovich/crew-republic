import type { BeerConfig } from '@/components/BeerExperience/types';

export const firesideConfig: BeerConfig = {
  slug: 'fireside',
  shopWrapperClassName: 'shopWrapperFireside',
  heroIndicatorLabel: 'Cheers',
  shopIndicatorLabel: 'stock',
  heroRotation: 0,
  totalFrames: 89,
  firstFrameSrc: '/images/fireside/animations/images/image_99.webp',
  heroBg: {
    src: '/images/fireside/hero-anchor-bg.svg',
    width: 832,
    height: 932,
    alt: 'Fireside Flame Graphic',
  },
  lottiePath: '/images/fireside/animations/Fireside-glas.json',
  badges: {
    ipa: {
      src: '/images/fireside/stats/badge-ipa.svg',
      alt: 'RED ALE',
      width: 120,
      height: 120,
    },
    alc: {
      src: '/images/fireside/stats/badge-alc.svg',
      alt: 'ALC. 5,8% VOL',
      width: 120,
      height: 120,
    },
    plato: {
      src: '/images/fireside/stats/badge-plato.svg',
      alt: '13° PLATO',
      width: 120,
      height: 120,
    },
  },
  tastometer: {
    desktopSrc: '/images/fireside/tastometer/tastecard-desktop.svg',
    mobileSrc: '/images/fireside/tastometer/tastecard-mobile.svg',
    alt: 'Fireside Taste Card',
  },
  awards: [
    {
      id: 'award-2',
      src: '/images/awards/awards-2.webp',
      width: 200,
      height: 200,
      alt: 'European Beer Star The Beer Tasting Gold Award',
    },
  ],
};

