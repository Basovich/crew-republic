'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import type { AnimationItem } from 'lottie-web';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/Button/Button';
import { Heading } from '@/components/Heading';
import {
  BEER_ANIMATIONS,
  loadBeerAnimation,
  preloadBeerAnimations,
} from './animationCache';
import styles from './BeersSection.module.scss';

export interface BeerCardItem {
  id: string;
  key: 'drunkenSailor' | 'jackpot' | 'fireside';
  image: string;
  imageHover: string;
  shadow: string;
  href: string;
  isGlass?: boolean;
  title: string;
  tagline: string;
  alt: string;
  discoverLabel: string;
}

interface MobileBeerSliderClientProps {
  beers: BeerCardItem[];
  headingText: string;
}

export function MobileBeerSliderClient({
  beers,
  headingText,
}: MobileBeerSliderClientProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lottieContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const lottieInstancesRef = useRef<(AnimationItem | null)[]>([]);
  const [animationsReady, setAnimationsReady] = useState<boolean[]>([false, false, false]);

  // Preload animations on mobile mount
  useEffect(() => {
    preloadBeerAnimations();
  }, []);

  // Initialize Lottie instances once loaded
  useEffect(() => {
    let isCancelled = false;

    // Load lottie-web dynamically to avoid bundling on server
    import('lottie-web').then(({ default: lottie }) => {
      if (isCancelled) return;

      beers.forEach((beer, index) => {
        const container = lottieContainersRef.current[index];
        const animUrl = BEER_ANIMATIONS[beer.key];

        if (!container || !animUrl || lottieInstancesRef.current[index]) return;

        loadBeerAnimation(animUrl).then((animData) => {
          if (isCancelled || !animData || !container) return;

          // Clean up if already initialized
          lottieInstancesRef.current[index]?.destroy();

          const instance = lottie.loadAnimation({
            container,
            renderer: 'canvas',
            loop: false,
            autoplay: false,
            animationData: animData,
          });

          // Go to initial frame (facing front)
          instance.goToAndStop(0, true);
          lottieInstancesRef.current[index] = instance;

          setAnimationsReady((prev) => {
            const next = [...prev];
            next[index] = true;
            return next;
          });
        });
      });
    });

    return () => {
      isCancelled = true;
      lottieInstancesRef.current.forEach((instance) => instance?.destroy());
      lottieInstancesRef.current = [];
    };
  }, [beers]);

  // Handle scroll / swipe: synchronize rotation angle with horizontal position
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const scrollLeft = track.scrollLeft;
    const cards = track.querySelectorAll<HTMLElement>(`.${styles.card}`);
    if (cards.length === 0) return;

    // Track center in pixels
    const trackCenter = scrollLeft + track.clientWidth / 2;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distanceFromCenter = cardCenter - trackCenter;
      const cardWidth = card.clientWidth || 250;
      const stepDistance = cardWidth + 12; // card width + gap

      const instance = lottieInstancesRef.current[index];
      if (instance && instance.totalFrames) {
        const total = instance.totalFrames;

        // If card is centered within a tiny margin (4px), snap exactly to frame 0 (facing front)
        if (Math.abs(distanceFromCenter) <= 4) {
          instance.goToAndStop(0, true);
          return;
        }

        // Normalized offset (-1 to 1 across one card swipe step)
        const offsetRatio = distanceFromCenter / stepDistance;

        let frame = Math.round((offsetRatio * total) % total);
        if (frame < 0) frame += total;
        if (frame >= total) frame = 0;

        instance.goToAndStop(frame, true);
      }
    });
  }, []);

  // Listen for scroll and scrollend to guarantee frame 0 at rest
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const onScrollEnd = () => {
      const scrollLeft = track.scrollLeft;
      const cards = track.querySelectorAll<HTMLElement>(`.${styles.card}`);
      const trackCenter = scrollLeft + track.clientWidth / 2;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distanceFromCenter = Math.abs(cardCenter - trackCenter);

        // If this card is within 15px of center at the end of scrolling, snap directly to front
        if (distanceFromCenter < 15) {
          const instance = lottieInstancesRef.current[index];
          if (instance) {
            instance.goToAndStop(0, true);
          }
        }
      });
    };

    const onScrollWithDebounce = () => {
      handleScroll();
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(onScrollEnd, 150);
    };

    track.addEventListener('scroll', onScrollWithDebounce, { passive: true });
    track.addEventListener('scrollend', onScrollEnd, { passive: true });

    return () => {
      track.removeEventListener('scroll', onScrollWithDebounce);
      track.removeEventListener('scrollend', onScrollEnd);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [handleScroll]);

  return (
    <div
      ref={trackRef}
      className={styles.sliderTrack}
      role="region"
      aria-label={headingText}
    >
      {beers.map((beer, index) => (
        <article key={beer.id} className={styles.card}>
          <Link
            href={beer.href}
            className={styles.imageContainer}
            aria-label={beer.title}
          >
            <div
              className={`${styles.imageWrapper} ${beer.isGlass ? styles.imageWrapperGlass : ''}`}
            >
              {/* Lottie rolling canvas container (active on mobile once ready) */}
              <div
                ref={(el) => {
                  lottieContainersRef.current[index] = el;
                }}
                className={`${styles.lottieCan} ${animationsReady[index] ? styles.lottieVisible : ''}`}
                aria-hidden="true"
              />

              {/* Static WebP fallback while Lottie loads or on desktop */}
              <Image
                src={beer.image}
                alt={beer.alt}
                fill
                sizes="(max-width: 768px) 75vw, 382px"
                className={`${styles.image} ${styles.imageDefault} ${animationsReady[index] ? styles.imageFadeOut : ''}`}
                priority={index === 0}
              />
              <Image
                src={beer.imageHover}
                alt=""
                fill
                aria-hidden="true"
                sizes="(max-width: 768px) 75vw, 382px"
                className={`${styles.image} ${styles.imageHover}`}
              />
            </div>

            {/* Authentic shadow with floor reflection */}
            <div
              className={`${styles.shadowWrapper} ${beer.isGlass ? styles.shadowWrapperGlass : styles.shadowWrapperCan}`}
              aria-hidden="true"
            >
              <Image
                src={beer.shadow}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 768px) 75vw, 384px"
                className={styles.shadowImage}
              />
            </div>
          </Link>

          <div className={styles.content}>
            <div className={styles.titles}>
              <Heading level="h3" as="h3" className={styles.beerTitle}>
                {beer.title}
              </Heading>
              <Heading level="tagline" as="span" className={styles.beerTagline}>
                {beer.tagline}
              </Heading>
            </div>

            <div className={styles.action}>
              <Button
                variant="primary"
                size="md"
                href={beer.href}
                className={styles.button}
              >
                {beer.discoverLabel}
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

