'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/Button/Button';
import { Heading } from '@/components/Heading';
import styles from './RepresentSection.module.scss';

const SLIDES: string[] = [
  '/images/represent/represent-1.webp',
  '/images/represent/represent-2.webp',
  '/images/represent/represent-3.webp',
  '/images/represent/represent-4.webp',
];

interface RepresentSectionProps {
  heading: string;
  buttonText: string;
  imageAlt: string;
  shopUrl?: string;
}

export function RepresentSection({
  heading,
  buttonText,
  imageAlt,
  shopUrl = 'https://www.crew-republic-shop.de/',
}: RepresentSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(SLIDES.length - 1);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    // Fast-paced 0.5-second image transition loop
    const interval = setInterval(() => {
      setActiveIndex((current) => {
        setPrevIndex(current);
        return (current + 1) % SLIDES.length;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.section} aria-labelledby="represent-heading">
      <div className={styles.cardContainer}>
        {/* Slideshow background layers */}
        <div className={styles.slidesWrapper} aria-hidden="true">
          {SLIDES.map((src, index) => {
            const isActive = index === activeIndex;
            const isPrevious = index === prevIndex;

            let slideClass = styles.slide;
            if (isActive) {
              slideClass = `${styles.slide} ${styles.active}`;
            } else if (isPrevious) {
              slideClass = `${styles.slide} ${styles.previous}`;
            }

            return (
              <div key={src} className={slideClass}>
                <Image
                  src={src}
                  alt={isActive ? imageAlt : ''}
                  fill
                  sizes="(max-width: 768px) 358px, 1200px"
                  priority={index === 0}
                  className={styles.slideImage}
                />
              </div>
            );
          })}
        </div>

        {/* Contrast darkening overlay */}
        <div className={styles.overlay} aria-hidden="true" />

        {/* Centered Heading and Merch Button */}
        <div className={styles.content}>
          <Heading id="represent-heading" level="h2" as="h2" className={styles.heading}>
            {heading}
          </Heading>

          <div className={styles.action}>
            <Button
              variant="primary"
              size="lg"
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.button}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
