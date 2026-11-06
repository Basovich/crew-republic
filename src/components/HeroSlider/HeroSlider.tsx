'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Heading } from '@/components/Heading';
import styles from './HeroSlider.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Slide {
  id: number;
  src: string;
  alt: string;
  aspectRatio: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    src: '/images/hero/slide-1.webp',
    alt: 'Friends enjoying craft beer at Munich bar counter',
    aspectRatio: '974 / 548',
  },
  {
    id: 2,
    src: '/images/hero/slide-2.webp',
    alt: 'Friends laughing outside corner store with CREW Republic cans',
    aspectRatio: '329 / 548',
  },
  {
    id: 3,
    src: '/images/hero/slide-3.webp',
    alt: 'Toasting CREW Republic craft beer cans over vinyl record player',
    aspectRatio: '548 / 548',
  },
  {
    id: 4,
    src: '/images/hero/slide-4.webp',
    alt: 'Pints of craft beer and Drunken Sailor at wooden tavern table',
    aspectRatio: '438 / 548',
  },
  {
    id: 5,
    src: '/images/hero/slide-5.webp',
    alt: 'CREW Republic craft beer lifestyle moments with friends',
    aspectRatio: '974 / 548',
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

  // Slider track refs
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);

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

    const cleanup = setupTrackLoop(trackRef.current, singleSetRef.current);

    return () => {
      cleanup();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // GSAP Entrance & Scroll Parallax Animation
  // ---------------------------------------------------------------------------
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) return;

      const slider = containerRef.current;
      const wordChunks = slider?.querySelectorAll(`.${styles.wordChunk}`);

      if (!slider || !wordChunks || wordChunks.length === 0) return;

      // 1. Entrance timeline
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.1,
      });

      // Images scale-up + blur reveal
      tl.fromTo(
        slider,
        {
          opacity: 0,
          scale: 0.93,
          y: 35,
          filter: 'blur(10px)',
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.3,
          ease: 'power3.out',
        }
      );

      // Headline 3D reveal from below with stagger
      tl.fromTo(
        wordChunks,
        {
          opacity: 0,
          y: 80,
          rotateX: 25,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.1,
          duration: 1.0,
          ease: 'power4.out',
        },
        '-=0.9'
      );

      // Parallax on track inside slider
      const track = trackRef.current;
      if (track) {
        gsap.to(track, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
          y: 60,
          opacity: 0.4,
          ease: 'none',
        });
      }
    },
    { scope: containerRef }
  );

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
        {/* Continuous Track for All Viewports */}
        <div className={styles.sliderTrack} ref={trackRef}>
          {/* Set 1 */}
          <div
            className={styles.trackGroup}
            ref={singleSetRef}
            style={{ gap: 'inherit' }}
          >
            {SLIDES.map((slide) => (
              <div
                key={`set1-${slide.id}`}
                className={styles.slideItem}
                style={{ aspectRatio: slide.aspectRatio }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 40vw, 35vw"
                  priority={slide.id <= 2}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Set 2 */}
          <div className={styles.trackGroup} style={{ gap: 'inherit' }}>
            {SLIDES.map((slide) => (
              <div
                key={`set2-${slide.id}`}
                className={styles.slideItem}
                style={{ aspectRatio: slide.aspectRatio }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 40vw, 35vw"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Set 3 */}
          <div className={styles.trackGroup} style={{ gap: 'inherit' }}>
            {SLIDES.map((slide) => (
              <div
                key={`set3-${slide.id}`}
                className={styles.slideItem}
                style={{ aspectRatio: slide.aspectRatio }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 40vw, 35vw"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Headline Overlay anchored to the bottom of the slider images */}
        <div className={styles.overlay}>
          <Heading level="h1" as="h1" className={styles.headline}>
            <span className={styles.line}>
              {line1Parts.map((chunk, idx) => (
                <React.Fragment key={`l1-${idx}`}>
                  <span className={styles.wordChunk}>{chunk}</span>
                  {idx < line1Parts.length - 1 && ' '}
                </React.Fragment>
              ))}
            </span>
            <span className={styles.line}>
              {line2Parts.map((chunk, idx) => (
                <React.Fragment key={`l2-${idx}`}>
                  <span className={styles.wordChunk}>{chunk}</span>
                  {idx < line2Parts.length - 1 && ' '}
                </React.Fragment>
              ))}
            </span>
          </Heading>
        </div>
      </div>
    </section>
  );
}
