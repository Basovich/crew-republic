'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Button } from '@/components/Button/Button';
import { Heading } from '@/components/Heading';
import styles from './StorySection.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface ActionButton {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'giant';
  target?: string;
  rel?: string;
}

export interface StorySectionClientProps {
  id: string;
  headingId: string;
  heading: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  buttons: ActionButton[];
  imagePosition: 'left' | 'right';
  headingClassName?: string;
}

export function StorySectionClient({
  id,
  headingId,
  heading,
  description,
  imageSrc,
  imageAlt,
  buttons,
  imagePosition,
  headingClassName,
}: StorySectionClientProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 1024px)',
          isMobile: '(max-width: 1023px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const reduceMotion = Boolean(context.conditions?.reduceMotion);
          if (reduceMotion) return;

          const isDesktop = Boolean(context.conditions?.isDesktop);

          const imageSlot = section.querySelector<HTMLElement>('[data-story-slot]');
          const imageFrame = section.querySelector<HTMLElement>('[data-story-frame]');
          const imageInner = section.querySelector<HTMLElement>('[data-story-image-inner]');
          const revealSlots = gsap.utils.toArray<HTMLElement>(
            section.querySelectorAll('[data-story-reveal-trigger]')
          );

          // 1. Desktop outer frame vertical parallax relative to overlapping headline
          if (isDesktop && imageFrame) {
            gsap.fromTo(
              imageFrame,
              { y: 75 },
              {
                y: -75,
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            );
          }

          // 2. Inner clipped window parallax (camera depth inside overflow: hidden frame)
          if (imageSlot && imageInner) {
            gsap.fromTo(
              imageInner,
              { yPercent: 6.5 },
              {
                yPercent: -6.5,
                ease: 'none',
                scrollTrigger: {
                  trigger: imageSlot,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            );
          }

          // 3. Scrubbed sequential slide-up + opacity reveal on heading, copy & CTA
          const yOffset = isDesktop ? 64 : 40;
          const startPos = isDesktop ? 'top 88%' : 'top 90%';
          const endDistance = isDesktop ? '+=240' : '+=200';

          revealSlots.forEach((slot) => {
            const target = slot.querySelector<HTMLElement>('[data-story-reveal-target]');
            if (!target) return;

            gsap.fromTo(
              target,
              { y: yOffset, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: slot,
                  start: startPos,
                  end: endDistance,
                  scrub: 0.45,
                },
              }
            );
          });
        }
      );

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  const containerClasses = [
    styles.container,
    imagePosition === 'left' ? styles.imageLeft : '',
  ]
    .filter(Boolean)
    .join(' ');

  const resolvedHeadingClass = headingClassName
    ? (styles[headingClassName] ?? headingClassName)
    : '';

  const headingClasses = [styles.heading, resolvedHeadingClass]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      ref={sectionRef}
      id={id}
      className={styles.section}
      aria-labelledby={headingId}
    >
      <div className={containerClasses}>
        <div className={styles.content}>
          <div className={styles.revealSlot} data-story-reveal-trigger>
            <Heading
              id={headingId}
              level="h2"
              as="h2"
              className={headingClasses}
              data-story-reveal-target
            >
              {heading}
            </Heading>
          </div>

          <div className={styles.textBlock}>
            <div className={styles.revealSlot} data-story-reveal-trigger>
              <p className={styles.description} data-story-reveal-target>
                {description}
              </p>
            </div>

            {buttons.length > 0 && (
              <div className={styles.action} data-story-reveal-trigger>
                <div className={styles.buttonGroup} data-story-reveal-target>
                  {buttons.map((btn, index) => (
                    <Button
                      key={`${btn.label}-${index}`}
                      variant={btn.variant ?? 'secondary'}
                      size={btn.size ?? 'lg'}
                      href={btn.href}
                      target={btn.target}
                      rel={btn.rel}
                      className={styles.button}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.imageSlot} data-story-slot>
          <div className={styles.imageFrame} data-story-frame>
            <div className={styles.imageInner} data-story-image-inner>
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 568px"
                className={styles.image}
              />
            </div>
            <div className={styles.aiBadge} aria-label="AI generated image" title="AI generated">
              <span>AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
