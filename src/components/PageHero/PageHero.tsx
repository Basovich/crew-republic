import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header/Header';
import styles from './PageHero.module.scss';

interface PageHeroProps {
  currentLocale: string;
  currentPath?: string;
  line1: string;
  line2: string;
  imageSrc: string;
  imageAlt: string;
}

export function PageHero({
  currentLocale,
  currentPath = '/brand-story',
  line1,
  line2,
  imageSrc,
  imageAlt,
}: PageHeroProps) {
  return (
    <section className={styles.heroSection} aria-label="Brand Story Hero">
      {/* Top Header with Logo and Language Switcher */}
      <Header currentLocale={currentLocale} currentPath={currentPath} />

      <div className={styles.heroCard}>
        {/* Background Image */}
        <div className={styles.imageWrapper}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
          />
        </div>

        {/* Bottom Headline anchored to the bottom of the hero card */}
        <div className={styles.overlay}>
          <h1 className={styles.heading}>
            <span className={styles.line}>{line1}</span>
            <span className={styles.line}>{line2}</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
