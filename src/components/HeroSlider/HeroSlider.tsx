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

const SLIDES: Slide[] = [
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

interface HeroSliderProps {
  line1?: string;
  line2?: string;
}

export function HeroSlider({
  line1 = 'BECAUSE GOOD COMPANY',
  line2 = 'DESERVES BETTER BEER.',
}: HeroSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const singleSet = singleSetRef.current;
    const container = containerRef.current;
    if (!track || !singleSet || !container) return;

    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Base continuous floating speed (pixels per 60fps frame)
    const baseSpeed = prefersReducedMotion ? 0 : -0.65;
    let targetX = 0;
    let currentX = 0;
    let velocity = baseSpeed;
    let isDragging = false;
    let lastX = 0;
    let lastTime = 0;
    let dragVelocity = 0;

    const getSetWidth = () => singleSet.offsetWidth || 2000;

    // Ultra-smooth GSAP Ticker animation loop with delta-time normalization
    const updateTicker = (_time: number, deltaTime: number) => {
      const setWidth = getSetWidth();
      // Normalize delta time to 60fps baseline (16.667ms)
      const deltaRatio = Math.min(2.5, Math.max(0.2, deltaTime / 16.667));

      if (!isDragging) {
        // Smoothly decay velocity back to base float speed
        velocity += (baseSpeed - velocity) * (0.04 * deltaRatio);
        targetX += velocity * deltaRatio;
      }

      // Smooth interpolation (lerp) for buttery motion without micro-stutters
      currentX += (targetX - currentX) * (0.14 * deltaRatio);

      // Seamless infinite wrapping
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

    // Pointer events for smooth mouse drag and mobile touch
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
      currentX += dx * 0.75; // Immediate feedback while maintaining smooth lerp

      // Calculate instantaneous drag velocity with clamping
      const instantVelocity = (dx / dt) * 16.667;
      dragVelocity = Math.max(-28, Math.min(28, instantVelocity));

      lastX = e.clientX;
      lastTime = now;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      // Transfer drag velocity to momentum
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
  }, []);

  return (
    <section className={styles.heroSection} aria-label="Hero showcase">
      <div className={styles.sliderContainer} ref={containerRef}>
        <div className={styles.track} ref={trackRef}>
          {/* First set - used to measure total width */}
          <div className={styles.track} ref={singleSetRef} style={{ gap: 'inherit' }}>
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
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 35vw"
                  priority={slide.id <= 2}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Second duplicate set */}
          <div className={styles.track} style={{ gap: 'inherit' }}>
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
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 35vw"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Third duplicate set for seamless endless wrap */}
          <div className={styles.track} style={{ gap: 'inherit' }}>
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
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 35vw"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Headline Overlay anchored to the bottom of the slider images */}
        <div className={styles.overlay}>
          <h1 className={styles.headline}>
            <span className={styles.line}>{line1}</span>
            <span className={styles.line}>{line2}</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
