'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Link } from '@/i18n/routing';
import { Heading } from '@/components/Heading';
import { Button } from '@/components/Button/Button';
import { FloatingActions } from '@/components/FloatingActions/FloatingActions';
import styles from './NotFoundView.module.scss';

gsap.registerPlugin(useGSAP);

interface FloatingCanSpec {
  id: string;
  src: string;
  mLeft: string;
  mTop: string;
  mWidth: string;
  dLeft: string;
  dTop: string;
  dWidth: string;
  rotate: number;
  floatY: number;
  floatRotate: number;
  duration: number;
  delay: number;
}

const FLOATING_CANS: FloatingCanSpec[] = [
  {
    id: 'can-1',
    src: '/images/not-found/can-jackpot.webp',
    mLeft: '-99.2%',
    mTop: '22.0%',
    mWidth: '121.1%',
    dLeft: '-12.5%',
    dTop: '16.0%',
    dWidth: '55.65%',
    rotate: 0,
    floatY: -18,
    floatRotate: -3.2,
    duration: 2.1,
    delay: 0,
  },
  {
    id: 'can-2',
    src: '/images/not-found/can-drunken-sailor.webp',
    mLeft: '-108.9%',
    mTop: '64.2%',
    mWidth: '89.4%',
    dLeft: '-16.94%',
    dTop: '75.1%',
    dWidth: '41.05%',
    rotate: -36,
    floatY: 16,
    floatRotate: 3.0,
    duration: 2.4,
    delay: 0.15,
  },
  {
    id: 'can-3',
    src: '/images/not-found/can-drunken-sailor.webp',
    mLeft: '71.0%',
    mTop: '-19.2%',
    mWidth: '63.3%',
    dLeft: '73.26%',
    dTop: '-30.76%',
    dWidth: '29.03%',
    rotate: 0,
    floatY: 14,
    floatRotate: -2.8,
    duration: 1.85,
    delay: 0.3,
  },
  {
    id: 'can-4',
    src: '/images/not-found/can-drunken-sailor.webp',
    mLeft: '-30.5%',
    mTop: '10.8%',
    mWidth: '63.3%',
    dLeft: '20.97%',
    dTop: '3.13%',
    dWidth: '29.03%',
    rotate: 0,
    floatY: -15,
    floatRotate: 3.5,
    duration: 2.0,
    delay: 0.08,
  },
  {
    id: 'can-5',
    src: '/images/not-found/can-drunken-sailor.webp',
    mLeft: '74.9%',
    mTop: '42.7%',
    mWidth: '88.3%',
    dLeft: '67.5%',
    dTop: '44.92%',
    dWidth: '40.56%',
    rotate: -35,
    floatY: 18,
    floatRotate: -3.1,
    duration: 2.25,
    delay: 0.22,
  },
  {
    id: 'can-6',
    src: '/images/not-found/can-drunken-sailor.webp',
    mLeft: '53.8%',
    mTop: '26.9%',
    mWidth: '93.3%',
    dLeft: '55.0%',
    dTop: '12.4%',
    dWidth: '42.85%',
    rotate: 0,
    floatY: -20,
    floatRotate: 2.9,
    duration: 2.5,
    delay: 0.05,
  },
  {
    id: 'can-7',
    src: '/images/not-found/can-drunken-sailor.webp',
    mLeft: '-40.0%',
    mTop: '58.8%',
    mWidth: '93.1%',
    dLeft: '12.78%',
    dTop: '63.48%',
    dWidth: '42.85%',
    rotate: 0,
    floatY: 17,
    floatRotate: -3.0,
    duration: 2.15,
    delay: 0.18,
  },
  {
    id: 'can-8',
    src: '/images/not-found/can-jackpot.webp',
    mLeft: '11.2%',
    mTop: '68.6%',
    mWidth: '121.1%',
    dLeft: '37.29%',
    dTop: '65.23%',
    dWidth: '55.65%',
    rotate: 0,
    floatY: -18,
    floatRotate: 2.7,
    duration: 2.35,
    delay: 0.12,
  },
  {
    id: 'can-9',
    src: '/images/not-found/can-jackpot.webp',
    mLeft: '20.2%',
    mTop: '-0.1%',
    mWidth: '82.0%',
    dLeft: '42.36%',
    dTop: '-21.48%',
    dWidth: '37.66%',
    rotate: 0,
    floatY: 15,
    floatRotate: -3.4,
    duration: 1.95,
    delay: 0.28,
  },
  {
    id: 'can-10',
    src: '/images/not-found/can-jackpot.webp',
    mLeft: '-61.5%',
    mTop: '-21.4%',
    mWidth: '99.5%',
    dLeft: '-8.4%',
    dTop: '-40.72%',
    dWidth: '45.7%',
    rotate: 35,
    floatY: -15,
    floatRotate: 2.5,
    duration: 2.2,
    delay: 0.35,
  },
  {
    id: 'can-11',
    src: '/images/not-found/can-jackpot.webp',
    mLeft: '93.8%',
    mTop: '14.7%',
    mWidth: '99.5%',
    dLeft: '76.18%',
    dTop: '5.86%',
    dWidth: '45.7%',
    rotate: 35,
    floatY: 19,
    floatRotate: -2.8,
    duration: 2.55,
    delay: 0.1,
  },
  {
    id: 'can-12',
    src: '/images/not-found/can-jackpot.webp',
    mLeft: '-134.4%',
    mTop: '11.2%',
    mWidth: '99.5%',
    dLeft: '-28.68%',
    dTop: '0.98%',
    dWidth: '45.7%',
    rotate: 35,
    floatY: -17,
    floatRotate: 3.0,
    duration: 2.3,
    delay: 0.2,
  },
];

export function NotFoundView() {
  const t = useTranslations('NotFoundPage');
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) return;

      // Subtle entrance for central content
      gsap.from('[data-nf-reveal]', {
        autoAlpha: 0,
        y: 28,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
      });

      // Gentle zero-gravity drift for each background can
      FLOATING_CANS.forEach((can) => {
        gsap.to(`[data-can-id="${can.id}"]`, {
          y: can.floatY,
          rotation: can.rotate + can.floatRotate,
          duration: can.duration,
          delay: can.delay,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <main
      ref={containerRef}
      data-not-found="true"
      className={styles.page}
    >
      {/* Background Decorative Cans Layer */}
      <div className={styles.cansLayer} aria-hidden="true">
        {FLOATING_CANS.map((can, idx) => {
          const cssVars = {
            '--m-left': can.mLeft,
            '--m-top': can.mTop,
            '--m-width': can.mWidth,
            '--d-left': can.dLeft,
            '--d-top': can.dTop,
            '--d-width': can.dWidth,
            transform: `rotate(${can.rotate}deg)`,
          } as React.CSSProperties;

          return (
            <div
              key={can.id}
              data-can-id={can.id}
              className={styles.canItem}
              style={cssVars}
            >
              <Image
                src={can.src}
                alt=""
                fill
                sizes="(max-width: 767px) 95vw, 45vw"
                priority={idx < 4}
                draggable={false}
                className={styles.canImage}
              />
            </div>
          );
        })}
      </div>

      {/* Top Centered Square Logo */}
      <header className={styles.header}>
        <Link
          href="/"
          className={styles.logoLink}
          aria-label={t('logoAriaLabel')}
        >
          <Image
            src="/images/Logo-Header.svg"
            alt={t('logoAlt')}
            width={157}
            height={146}
            priority
            className={styles.logoImage}
          />
        </Link>
      </header>

      {/* Center 404 Message & Back Home CTA */}
      <section className={styles.content} aria-labelledby="not-found-heading">
        <div className={styles.headlines}>
          <div
            data-nf-reveal
            className={styles.codeRow}
            role="img"
            aria-label={t('codeAriaLabel')}
          >
            <span className={styles.digit} aria-hidden="true">
              4
            </span>
            <span className={styles.grenadeWrap} aria-hidden="true">
              <Image
                src="/images/not-found/hop-grenade.svg"
                alt={t('grenadeAlt')}
                width={162}
                height={246}
                priority
                className={styles.grenadeIcon}
              />
            </span>
            <span className={styles.digit} aria-hidden="true">
              4
            </span>
          </div>

          <Heading
            id="not-found-heading"
            data-nf-reveal
            level="h1"
            as="h1"
            className={styles.headline}
          >
            {t('heading')}
          </Heading>

          <p data-nf-reveal className={styles.description}>
            <span>{t('line1')}</span>
            <br />
            <span>{t('line2')}</span>
          </p>
        </div>

        <div data-nf-reveal className={styles.actions}>
          <Button
            variant="secondary"
            size="lg"
            href="/"
            className={styles.backButton}
          >
            {t('backHome')}
          </Button>
        </div>
      </section>

      {/* Bottom-Left Imprint Link */}
      <Link href="/imprint" className={styles.imprintLink}>
        {t('imprint')}
      </Link>

      {/* Bottom-Right Shop Floating Action Button (without central MENU pill) */}
      <FloatingActions hideNavigation />
    </main>
  );
}

