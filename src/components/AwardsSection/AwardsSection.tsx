'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './AwardsSection.module.scss';

export interface Award {
  id: string;
  src: string;
  width: number;
  height: number;
  altKey: string;
}

const AWARDS: Award[] = [
  {
    id: 'awards-1',
    src: '/images/awards/awards-1.webp',
    width: 158,
    height: 200,
    altKey: 'award1',
  },
  {
    id: 'awards-2',
    src: '/images/awards/awards-2.webp',
    width: 200,
    height: 200,
    altKey: 'award2',
  },
  {
    id: 'awards-3',
    src: '/images/awards/awards-3.webp',
    width: 158,
    height: 200,
    altKey: 'award3',
  },
  {
    id: 'awards-4',
    src: '/images/awards/awards-4.webp',
    width: 200,
    height: 200,
    altKey: 'award4',
  },
  {
    id: 'awards-5',
    src: '/images/awards/awards-5.webp',
    width: 200,
    height: 200,
    altKey: 'award5',
  },
  {
    id: 'awards-6',
    src: '/images/awards/awards-6.webp',
    width: 182,
    height: 199,
    altKey: 'award6',
  },
  {
    id: 'awards-7',
    src: '/images/awards/awards-7.webp',
    width: 166,
    height: 200,
    altKey: 'award7',
  },
];

interface AwardsSectionProps {
  heading: string;
  ariaLabel: string;
  awardTranslations: Record<string, string>;
}

export function AwardsSection({
  heading,
  ariaLabel,
  awardTranslations,
}: AwardsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const singleSet = singleSetRef.current;
    if (!container || !track || !singleSet) return;

    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Base continuous floating speed (pixels per 60fps frame)
    const baseSpeed = prefersReducedMotion ? 0 : -0.75;

    let targetX = 0;
    let currentX = 0;
    let velocity = baseSpeed;
    let isDragging = false;
    let lastX = 0;
    let lastTime = 0;
    let dragVelocity = 0;

    const getSetWidth = () => singleSet.offsetWidth || 1400;

    const updateTicker = (_time: number, deltaTime: number) => {
      const setWidth = getSetWidth();
      const deltaRatio = Math.min(2.5, Math.max(0.2, deltaTime / 16.667));

      if (!isDragging) {
        velocity += (baseSpeed - velocity) * (0.04 * deltaRatio);
        targetX += velocity * deltaRatio;
      }

      currentX += (targetX - currentX) * (0.14 * deltaRatio);

      // Seamless endless loop
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
  }, []);

  const renderGroup = (isReference = false) => (
    <div
      ref={isReference ? singleSetRef : undefined}
      className={styles.trackGroup}
      aria-hidden={!isReference}
    >
      {AWARDS.map((award) => {
        const altText = awardTranslations[award.altKey] || award.id;
        const aspectRatio = `${award.width} / ${award.height}`;

        return (
          <div
            key={award.id}
            className={styles.awardItem}
            style={{ aspectRatio }}
          >
            <Image
              src={award.src}
              alt={isReference ? altText : ''}
              width={award.width}
              height={award.height}
              className={styles.awardImage}
              sizes="(max-width: 768px) 160px, 200px"
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <section className={styles.section} aria-labelledby="awards-heading">
      <div className={styles.container}>
        <h2 id="awards-heading" className={styles.heading}>
          {heading}
        </h2>

        {/* Draggable Endless Loop Track */}
        <div
          ref={containerRef}
          className={styles.sliderContainer}
          role="region"
          aria-label={ariaLabel}
        >
          <div ref={trackRef} className={styles.track}>
            {/* Set 1: reference set */}
            {renderGroup(true)}
            {/* Set 2 & 3: duplicated sets for seamless continuous wrapping */}
            {renderGroup(false)}
            {renderGroup(false)}
          </div>
        </div>
      </div>
    </section>
  );
}
