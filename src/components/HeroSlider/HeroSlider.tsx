'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './HeroSlider.module.scss';

interface Slide {
  id: number;
  src: string;
  alt: string;
  aspectRatio: string;
}

const DESKTOP_SLIDES: Slide[] = [
  {
    id: 1,
    src: '/images/hero/slide-1.webp',
    alt: 'Friends enjoying craft beer at Munich bar counter',
    aspectRatio: '944 / 531',
  },
  {
    id: 2,
    src: '/images/hero/slide-2.webp',
    alt: 'Friends laughing outside corner store with CREW Republic cans',
    aspectRatio: '360 / 600',
  },
  {
    id: 3,
    src: '/images/hero/slide-3.webp',
    alt: 'Toasting CREW Republic craft beer cans over vinyl record player',
    aspectRatio: '544 / 544',
  },
  {
    id: 4,
    src: '/images/hero/slide-4.webp',
    alt: 'Pints of craft beer and Drunken Sailor at wooden tavern table',
    aspectRatio: '473 / 600',
  },
];

const MOBILE_SLIDES: Slide[] = [
  {
    id: 1,
    src: '/images/hero/mobile-slide-1.webp',
    alt: 'Friends enjoying craft beer at Munich bar counter',
    aspectRatio: '359 / 597',
  },
  {
    id: 2,
    src: '/images/hero/mobile-slide-2.webp',
    alt: 'Friends laughing outside corner store with CREW Republic cans',
    aspectRatio: '359 / 597',
  },
  {
    id: 3,
    src: '/images/hero/mobile-slide-3.webp',
    alt: 'CREW Republic craft beer cans and pints on tavern table',
    aspectRatio: '359 / 597',
  },
  {
    id: 4,
    src: '/images/hero/mobile-slide-4.webp',
    alt: 'CREW Republic craft beer cans on wooden table',
    aspectRatio: '359 / 597',
  },
  {
    id: 5,
    src: '/images/hero/mobile-slide-5.webp',
    alt: 'Friends laughing together over CREW Republic craft beer',
    aspectRatio: '359 / 597',
  },
];

interface HeroSliderProps {
  line1?: string;
  line2?: string;
}

export function HeroSlider({
  line1 = 'BECAUSE GOOD COMPANY',
  line2 = 'DESERVES BETTER BEER.',
}: HeroSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Desktop track refs
  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const desktopSingleSetRef = useRef<HTMLDivElement>(null);

  // Mobile track refs
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const mobileSingleSetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Base continuous floating speed (pixels per 60fps frame)
    const baseSpeed = prefersReducedMotion ? 0 : -0.65;

    const setupTrackLoop = (
      track: HTMLDivElement | null,
      singleSet: HTMLDivElement | null
    ) => {
      if (!track || !singleSet) return () => {};

      let targetX = 0;
      let currentX = 0;
      let velocity = baseSpeed;
      let isDragging = false;
      let lastX = 0;
      let lastTime = 0;
      let dragVelocity = 0;

      const getSetWidth = () => singleSet.offsetWidth || 2000;

      const updateTicker = (_time: number, deltaTime: number) => {
        const setWidth = getSetWidth();
        const deltaRatio = Math.min(2.5, Math.max(0.2, deltaTime / 16.667));

        if (!isDragging) {
          velocity += (baseSpeed - velocity) * (0.04 * deltaRatio);
          targetX += velocity * deltaRatio;
        }

        currentX += (targetX - currentX) * (0.14 * deltaRatio);

        while (targetX <= -setWidth) {
          targetX += setWidth;
          currentX += setWidth;
        }
        while (targetX > 0) {
          targetX -= setWidth;
          currentX -= setWidth;
        }

        track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
      };

      gsap.ticker.add(updateTicker);

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        lastX = e.clientX;
        lastTime = performance.now();
        dragVelocity = 0;
        container.setPointerCapture(e.pointerId);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const now = performance.now();
        const dt = Math.max(1, now - lastTime);
        const dx = e.clientX - lastX;

        targetX += dx;
        currentX += dx * 0.75;

        const instantVelocity = (dx / dt) * 16.667;
        dragVelocity = Math.max(-28, Math.min(28, instantVelocity));

        lastX = e.clientX;
        lastTime = now;
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;
        velocity = dragVelocity * 0.85;

        if (container.hasPointerCapture(e.pointerId)) {
          container.releasePointerCapture(e.pointerId);
        }
      };

      container.addEventListener('pointerdown', onPointerDown);
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerup', onPointerUp);
      container.addEventListener('pointercancel', onPointerUp);

      return () => {
        gsap.ticker.remove(updateTicker);
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerup', onPointerUp);
        container.removeEventListener('pointercancel', onPointerUp);
      };
    };

    const mm = gsap.matchMedia();

    mm.add('(max-width: 767px)', () => {
      return setupTrackLoop(mobileTrackRef.current, mobileSingleSetRef.current);
    });

    mm.add('(min-width: 768px)', () => {
      return setupTrackLoop(
        desktopTrackRef.current,
        desktopSingleSetRef.current
      );
    });

    return () => {
      mm.revert();
    };
  }, []);

  const line1Parts =
    line1 === 'BECAUSE GOOD COMPANY'
      ? ['BECAUSE GOOD', 'COMPANY']
      : [line1];
  const line2Parts =
    line2 === 'DESERVES BETTER BEER.'
      ? ['DESERVES', 'BETTER BEER.']
      : [line2];

  return (
    <section className={styles.heroSection} aria-label="Hero showcase">
      <div className={styles.sliderContainer} ref={containerRef}>
        {/* Mobile Track Set (Active on mobile < 768px) */}
        <div className={styles.mobileTrack} ref={mobileTrackRef}>
          {/* Set 1 */}
          <div
            className={styles.trackGroup}
            ref={mobileSingleSetRef}
            style={{ gap: 'inherit' }}
          >
            {MOBILE_SLIDES.map((slide) => (
              <div
                key={`m-set1-${slide.id}`}
                className={styles.slideItem}
                style={{ aspectRatio: slide.aspectRatio }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="85vw"
                  priority={slide.id <= 2}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Set 2 */}
          <div className={styles.trackGroup} style={{ gap: 'inherit' }}>
            {MOBILE_SLIDES.map((slide) => (
              <div
                key={`m-set2-${slide.id}`}
                className={styles.slideItem}
                style={{ aspectRatio: slide.aspectRatio }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="85vw"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Set 3 */}
          <div className={styles.trackGroup} style={{ gap: 'inherit' }}>
            {MOBILE_SLIDES.map((slide) => (
              <div
                key={`m-set3-${slide.id}`}
                className={styles.slideItem}
                style={{ aspectRatio: slide.aspectRatio }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="85vw"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Track Set (Active on desktop >= 768px) */}
        <div className={styles.desktopTrack} ref={desktopTrackRef}>
          {/* Set 1 */}
          <div
            className={styles.trackGroup}
            ref={desktopSingleSetRef}
            style={{ gap: 'inherit' }}
          >
            {DESKTOP_SLIDES.map((slide) => (
              <div
                key={`d-set1-${slide.id}`}
                className={styles.slideItem}
                style={{ aspectRatio: slide.aspectRatio }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 1200px) 40vw, 35vw"
                  priority={slide.id <= 2}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Set 2 */}
          <div className={styles.trackGroup} style={{ gap: 'inherit' }}>
            {DESKTOP_SLIDES.map((slide) => (
              <div
                key={`d-set2-${slide.id}`}
                className={styles.slideItem}
                style={{ aspectRatio: slide.aspectRatio }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 1200px) 40vw, 35vw"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Set 3 */}
          <div className={styles.trackGroup} style={{ gap: 'inherit' }}>
            {DESKTOP_SLIDES.map((slide) => (
              <div
                key={`d-set3-${slide.id}`}
                className={styles.slideItem}
                style={{ aspectRatio: slide.aspectRatio }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 1200px) 40vw, 35vw"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Headline Overlay anchored to the bottom of the slider images */}
        <div className={styles.overlay}>
          <h1 className={styles.headline}>
            <span className={styles.line}>
              {line1Parts.map((chunk, idx) => (
                <span key={`l1-${idx}`} className={styles.wordChunk}>
                  {chunk}
                  {idx < line1Parts.length - 1 ? ' ' : ''}
                </span>
              ))}
            </span>
            <span className={styles.line}>
              {line2Parts.map((chunk, idx) => (
                <span key={`l2-${idx}`} className={styles.wordChunk}>
                  {chunk}
                  {idx < line2Parts.length - 1 ? ' ' : ''}
                </span>
              ))}
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
