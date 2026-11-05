import type { BeerConfig } from '@/components/BeerExperience/types';

export const jackpotConfig: BeerConfig = {
  slug: 'jackpot',
  heroIndicatorLabel: 'Howdy',
  firstFrameSrc: '/images/jackpot/animations/images/imgSeq_0.webp',
  heroBg: {
    src: '/images/jackpot/hero-anchor-bg.svg',
    width: 1053,
    height: 900,
    alt: 'Jackpot slot machine graphic',
  },
  lottiePath: '/images/jackpot/animations/JP_High_Angle_30.json',
  badges: {
    ipa: {
      src: '/images/jackpot/stats/badge-ipa.svg',
      alt: 'HAZY IPA',
      width: 120,
      height: 120,
    },
    alc: {
      src: '/images/jackpot/stats/badge-alc.svg',
      alt: 'ALC. 5,0% VOL',
      width: 120,
      height: 120,
    },
    plato: {
      src: '/images/jackpot/stats/badge-plato.svg',
      alt: '11° PLATO',
      width: 120,
      height: 120,
    },
  },
  tastometer: {
    desktopSrc: '/images/jackpot/tastometer/tastecard-desktop.svg',
    mobileSrc: '/images/jackpot/tastometer/tastecard-mobile.svg',
    alt: 'Jackpot Taste Card',
  },
  food: {
    itemLeft: {
      src: '/images/jackpot/food/beer.webp',
      alt: 'Jackpot Hazy IPA ice cold',
      width: 486,
      height: 398,
    },
    itemRight: {
      src: '/images/jackpot/food/friends.webp',
      alt: 'Friends enjoying beer together',
      width: 470,
      height: 376,
    },
  },
  awards: [
    {
      id: 'award-1',
      src: '/images/awards/awards-1.webp',
      width: 158,
      height: 200,
      alt: 'World Beer Awards Germany Gold',
    },
  ],
};

