import React from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/Button/Button';
import { Heading } from '@/components/Heading';
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

  return (
    <section className={styles.section} aria-labelledby="beers-heading">
      <div className={styles.container}>
        <Heading id="beers-heading" level="h2" as="h2" className={styles.heading}>
          {t('heading')}
        </Heading>

        {/* Scrollable track on mobile / flex row on desktop */}
        <div className={styles.sliderTrack} role="region" aria-label={t('heading')}>
          {BEERS.map((beer) => (
            <article key={beer.id} className={styles.card}>
              <Link
                href={beer.href}
                className={styles.imageContainer}
                aria-label={t(`${beer.key}.title`)}
              >
                <div
                  className={`${styles.imageWrapper} ${beer.isGlass ? styles.imageWrapperGlass : ''}`}
                >
                  <Image
                    src={beer.image}
                    alt={t(`${beer.key}.alt`)}
                    fill
                    sizes="(max-width: 768px) 240px, (max-width: 1200px) 33vw, 382px"
                    className={`${styles.image} ${styles.imageDefault}`}
                  />
                  <Image
                    src={beer.imageHover}
                    alt=""
                    fill
                    aria-hidden="true"
                    sizes="(max-width: 768px) 240px, (max-width: 1200px) 33vw, 382px"
                    className={`${styles.image} ${styles.imageHover}`}
                  />
                </div>
                {/* Authentic Figma shadow with floor reflection */}
                <div
                  className={`${styles.shadowWrapper} ${beer.isGlass ? styles.shadowWrapperGlass : styles.shadowWrapperCan}`}
                  aria-hidden="true"
                >
                  <Image
                    src={beer.shadow}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 240px, 384px"
                    className={styles.shadowImage}
                  />
                </div>
              </Link>

              <div className={styles.content}>
                <div className={styles.titles}>
                  <Heading level="h3" as="h3" className={styles.beerTitle}>
                    {t(`${beer.key}.title`)}
                  </Heading>
                  <Heading level="tagline" as="span" className={styles.beerTagline}>
                    {t(`${beer.key}.tagline`)}
                  </Heading>
                </div>

                <div className={styles.action}>
                  <Button
                    variant="primary"
                    size="md"
                    href={beer.href}
                    className={styles.button}
                  >
                    {t('discover')}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
