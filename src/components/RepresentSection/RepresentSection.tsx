'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/Button/Button';
import { Heading } from '@/components/Heading';
import styles from './RepresentSection.module.scss';

const DEFAULT_SLIDES: string[] = [
  '/images/represent/represent-1.webp',
  '/images/represent/represent-2.webp',
  '/images/represent/represent-3.webp',
  '/images/represent/represent-4.webp',
];

export interface RepresentActionButton {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
  target?: string;
  rel?: string;
  className?: string;
}

export interface RepresentSectionProps {
  heading: string;
  imageAlt: string;
  images?: string[];
  imageSrc?: string;
  buttonText?: string;
  shopUrl?: string;
  buttons?: RepresentActionButton[];
  badgeIcon?: React.ReactNode;
  id?: string;
}

export function RepresentSection({
  heading,
  buttonText,
  imageAlt,
  shopUrl = 'https://www.crew-republic-shop.de/Merch/',
  images,
  imageSrc,
  buttons,
  badgeIcon,
  id = 'represent-heading',
}: RepresentSectionProps) {
  // Resolve slides: if images or imageSrc provided, use them; otherwise use DEFAULT_SLIDES
  const resolvedSlides = React.useMemo(() => {
    if (images && images.length > 0) return images;
    if (imageSrc) return [imageSrc];
    return DEFAULT_SLIDES;
  }, [images, imageSrc]);

  const isAnimated = resolvedSlides.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(resolvedSlides.length - 1);

  useEffect(() => {
    if (!isAnimated) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    // 1-second image transition loop
    const interval = setInterval(() => {
      setActiveIndex((current) => {
        setPrevIndex(current);
        return (current + 1) % resolvedSlides.length;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAnimated, resolvedSlides.length]);

  // Resolve buttons list
  const actionButtons: RepresentActionButton[] = buttons && buttons.length > 0
    ? buttons
    : buttonText
      ? [
          {
            label: buttonText,
            href: shopUrl,
            variant: 'primary',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        ]
      : [];

  return (
    <section className={styles.section} aria-labelledby={id}>
      <div className={styles.cardContainer}>
        {/* Slideshow or single background image */}
        <div className={styles.slidesWrapper} aria-hidden="true">
          {resolvedSlides.map((src, index) => {
            const isActive = isAnimated ? index === activeIndex : true;
            const isPrevious = isAnimated ? index === prevIndex : false;

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

        {/* Centered Heading and Action Buttons */}
        <div className={styles.content}>
          <Heading id={id} level="h2" as="h2" className={styles.heading}>
            {heading}
          </Heading>

          {actionButtons.length > 0 && (
            <div className={styles.action}>
              <div className={styles.buttonGroup}>
                {actionButtons.map((btn, idx) => (
                  <Button
                    key={`${btn.label}-${idx}`}
                    variant={btn.variant || 'primary'}
                    size="lg"
                    href={btn.href}
                    target={btn.target}
                    rel={btn.rel}
                    className={`${styles.button} ${btn.className || ''}`.trim()}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Decorative badge area anchored to bottom right */}
        <div className={styles.bottomRightArea}>
          <div className={styles.aiBadge} aria-label="AI generated image" title="AI generated">
            <span>AI</span>
          </div>
          {badgeIcon && <div className={styles.badgeWrapper}>{badgeIcon}</div>}
        </div>
      </div>
    </section>
  );
}
