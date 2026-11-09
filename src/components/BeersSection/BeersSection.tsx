import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Heading } from '@/components/Heading';
import { MobileBeerSliderClient, type BeerCardItem } from './MobileBeerSliderClient';
import styles from './BeersSection.module.scss';

interface BeerCardData {
  id: string;
  key: 'drunkenSailor' | 'jackpot' | 'fireside';
  image: string;
  imageHover: string;
  shadow: string;
  href: string;
  isGlass?: boolean;
}

const BEERS: BeerCardData[] = [
  {
    id: 'drunken-sailor',
    key: 'drunkenSailor',
    image: '/images/beers/drunken-sailor.webp',
    imageHover: '/images/beers/drunken-sailor-hover.webp',
    shadow: '/images/beers/drunken-sailor-shadow.webp',
    href: '/drunken-sailor',
  },
  {
    id: 'jackpot',
    key: 'jackpot',
    image: '/images/beers/jackpot.webp',
    imageHover: '/images/beers/jackpot-hover.webp',
    shadow: '/images/beers/jackpot-shadow.webp',
    href: '/jackpot',
  },
  {
    id: 'fireside',
    key: 'fireside',
    image: '/images/beers/fireside.webp',
    imageHover: '/images/beers/fireside-hover.webp',
    shadow: '/images/beers/fireside-shadow.webp',
    href: '/fireside',
    isGlass: true,
  },
];

export async function BeersSection() {
  const t = await getTranslations('BeersSection');

  const beerItems: BeerCardItem[] = BEERS.map((beer) => ({
    ...beer,
    title: t(`${beer.key}.title`),
    tagline: t(`${beer.key}.tagline`),
    alt: t(`${beer.key}.alt`),
    discoverLabel: t('discover'),
  }));

  return (
    <section className={styles.section} aria-labelledby="beers-heading">
      <div className={styles.container}>
        <Heading id="beers-heading" level="h2" as="h2" className={styles.heading}>
          {t('heading')}
        </Heading>

        {/* Interactive scroll-snap & rolling can slider on mobile / flex row on desktop */}
        <MobileBeerSliderClient beers={beerItems} headingText={t('heading')} />
      </div>
    </section>
  );
}
