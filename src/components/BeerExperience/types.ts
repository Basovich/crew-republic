export interface BeerAward {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface FoodImageItem {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface BeerConfig {
  slug: string;
  heroShellClassName?: string;
  shopWrapperClassName?: string;
  heroIndicatorLabel?: string;
  shopIndicatorLabel?: string;
  heroRotation?: number;
  totalFrames?: number;
  firstFrameSrc: string;
  heroBg: {
    src: string;
    width: number;
    height: number;
    alt?: string;
  };
  lottiePath: string;
  badges: {
    ipa: { src: string; alt: string; width: number; height: number };
    alc: { src: string; alt: string; width: number; height: number };
    plato: { src: string; alt: string; width: number; height: number };
  };
  tastometer: {
    desktopSrc: string;
    mobileSrc: string;
    alt: string;
  };
  food?: {
    itemLeft: FoodImageItem;
    itemRight: FoodImageItem;
  };
  awards: BeerAward[];
}

export interface BeerTranslations {
  heading: string;
  subtitle: string;
  intro: {
    title: string;
    p1: string;
    p2: string;
  };
  stats: {
    ariaLabel: string;
  };
  tastometer: {
    hopsTitle: string;
    hopsValue: string;
    maltTitle: string;
    maltValue: string;
    colorTitle: string;
    colorValue: string;
    tempTitle: string;
    tempValue: string;
  };
  match: {
    tasteTitle: string;
    tasteText: string;
    drinkWithTitle: string;
    drinkWithText: string;
  };
  food?: {
    ariaLabel: string;
  };
  awards: {
    title: string;
    ariaLabel: string;
  };
  shop: {
    heading: string;
    button: string;
    url: string;
  };
}

