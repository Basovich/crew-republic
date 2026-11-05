import type { BeerConfig } from '@/components/BeerExperience/types';

export const drunkenSailorConfig: BeerConfig = {
  slug: 'drunken-sailor',
  heroIndicatorLabel: 'Ahoy',
  firstFrameSrc: '/images/drunken-sailor/animations/images/image_89.webp',
  heroBg: {
    src: '/images/drunken-sailor/hero-anchor-bg.svg',
    width: 798,
    height: 974,
  },
  lottiePath: '/images/drunken-sailor/animations/DS_High_Angel_30.json',
  badges: {
    ipa: {
      src: '/images/drunken-sailor/stats/badge-ipa.svg',
      alt: 'IPA',
      width: 120,
      height: 120,
    },
    alc: {
      src: '/images/drunken-sailor/stats/badge-alc.svg',
      alt: 'ALC. 6,4% VOL',
      width: 120,
      height: 120,
    },
    plato: {
      src: '/images/drunken-sailor/stats/badge-plato.svg',
      alt: '14° PLATO',
      width: 120,
      height: 120,
    },
  },
  tastometer: {
    desktopSrc: '/images/drunken-sailor/tastometer/tastecard-desktop.svg',
    mobileSrc: '/images/drunken-sailor/tastometer/tastecard-mobile.svg',
    alt: 'Drunken Sailor Taste Card',
  },
  food: {
    itemLeft: {
      src: '/images/drunken-sailor/food/food-thai.webp',
      alt: 'Food pairing - Thai cuisine',
      width: 537,
      height: 478,
    },
    itemRight: {
      src: '/images/drunken-sailor/food/food-burger.webp',
      alt: 'Food pairing - Steaks and burgers',
      width: 525,
      height: 421,
    },
  },
  awards: [
    {
      id: 'award-1',
      src: '/images/awards/awards-1.webp',
      width: 158,
      height: 200,
      alt: 'World Beer Awards Germany Gold 2023',
    },
    {
      id: 'award-4',
      src: '/images/awards/awards-4.webp',
      width: 200,
      height: 200,
      alt: "Meininger's International Craft Beer Award Gold 2022",
    },
    {
      id: 'award-5',
      src: '/images/awards/awards-5.webp',
      width: 200,
      height: 200,
      alt: "Meininger's International Craft Beer Award Gold 2021",
    },
    {
      id: 'award-6',
      src: '/images/awards/awards-6.webp',
      width: 182,
      height: 199,
      alt: 'European Beer Challenge Gold Medal 2021',
    },
    {
      id: 'award-7',
      src: '/images/awards/awards-7.webp',
      width: 166,
      height: 200,
      alt: "World Beer Awards World's Best IPA 2020",
    },
    {
      id: 'award-2',
      src: '/images/awards/awards-2.webp',
      width: 200,
      height: 200,
      alt: 'European Beer Star The Beer Tasting Gold Award',
    },
  ],
};

