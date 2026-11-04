'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { AnimationItem } from 'lottie-web';
import { Heading } from '@/components/Heading';
import { Button } from '@/components/Button/Button';
import type { BeerConfig, BeerTranslations } from './types';
import styles from './BeerExperience.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface BeerExperienceProps {
  config: BeerConfig;
  t: BeerTranslations;
  reverseFoodOnMobile?: boolean;
}

const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'intro', label: 'Intro' },
  { id: 'stats', label: 'Stats' },
  { id: 'tastometer', label: 'Tastometer' },
  { id: 'food', label: 'Food Pairings' },
  { id: 'awards', label: 'Awards' },
  { id: 'shop', label: 'Shop' },
];

export function BeerExperience({
  config,
  t,
  reverseFoodOnMobile = false,
}: BeerExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const storyTrackRef = useRef<HTMLDivElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const bottleViewportRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const heroHeadingsRef = useRef<HTMLDivElement>(null);
  const sideIndicatorRef = useRef<HTMLElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [isLoaded, setIsLoaded] = useState(false);

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ---------------------------------------------------------------------------
  // Lock body scroll while loader is active
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoaded]);

  // ---------------------------------------------------------------------------
  // Lottie Animation Loading & Frame 0 Pre-decoding
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isCancelled = false;

    async function initLottie() {
      if (!lottieContainerRef.current) return;

      const startTime = Date.now();
      console.log(`[BeerExperience ${config.slug}] 🚀 initLottie started`);

      // Clean up previous container content
      lottieContainerRef.current.innerHTML = '';

      // 1. Download & cache initial frame
      const firstFrameImg = new window.Image();
      firstFrameImg.src = config.firstFrameSrc;

      const frame0Promise = new Promise<void>((resolve) => {
        if (firstFrameImg.complete && firstFrameImg.naturalWidth > 0) {
          resolve();
        } else {
          firstFrameImg.onload = () => resolve();
          firstFrameImg.onerror = () => resolve();
        }
      });

      // 2. Load lottie-web module
      const lottieModule = await import('lottie-web');
      const lottie = lottieModule.default || lottieModule;

      if (isCancelled) return;

      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }

      if (lottieContainerRef.current) {
        lottieContainerRef.current.innerHTML = '';
      }

      const anim = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: config.lottiePath,
      });

      animRef.current = anim;

      const domLoadedPromise = new Promise<void>((resolve) => {
        anim.addEventListener('DOMLoaded', () => resolve());
        if (anim.isLoaded) {
          resolve();
        }
      });

      const minLoaderTime = 1200; // Complete at least one pulse cycle
      const maxSafetyTime = 10000; // 10s fallback

      let isReadyHandled = false;
      const handleReady = async () => {
        if (isReadyHandled || isCancelled) return;
        isReadyHandled = true;

        try {
          if (firstFrameImg.decode) {
            await firstFrameImg.decode();
          }
        } catch {
          // Ignore decode issues
        }

        if (animRef.current) {
          animRef.current.goToAndStop(0, true);
        }

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoaderTime - elapsed);

        setTimeout(() => {
          if (isCancelled) return;
          setIsLoaded(true);
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
        }, remaining);
      };

      const safetyTimer = setTimeout(() => {
        handleReady();
      }, maxSafetyTime);

      Promise.all([frame0Promise, domLoadedPromise]).then(() => {
        clearTimeout(safetyTimer);
        handleReady();
      });
    }

    initLottie();

    return () => {
      isCancelled = true;
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [config.firstFrameSrc, config.lottiePath, config.slug]);

  // ---------------------------------------------------------------------------
  // Entrance Transition: Expand Background & reveal content
  // ---------------------------------------------------------------------------
  useGSAP(
    () => {
      if (!isLoaded) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        if (anchorRef.current) {
          gsap.set(anchorRef.current, { clearProps: 'all' });
          anchorRef.current.removeAttribute('style');
        }
        if (bottleViewportRef.current) {
          gsap.set(bottleViewportRef.current, { opacity: 1, rotation: -9 });
        }
        if (heroHeadingsRef.current) {
          gsap.set(heroHeadingsRef.current, { opacity: 1, y: 0 });
        }
        if (sideIndicatorRef.current) {
          gsap.set(sideIndicatorRef.current, { opacity: 1 });
        }
        ScrollTrigger.refresh();
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (anchorRef.current) {
            gsap.set(anchorRef.current, { clearProps: 'all' });
            anchorRef.current.removeAttribute('style');
          }
          ScrollTrigger.refresh();
        },
      });

      tl.set(anchorRef.current, { zIndex: 100 })
        .fromTo(
          anchorRef.current,
          { scale: 0.22 },
          {
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            onComplete: () => {
              if (anchorRef.current) {
                gsap.set(anchorRef.current, { clearProps: 'all' });
                anchorRef.current.removeAttribute('style');
              }
            },
          }
        )
        .fromTo(
          bottleViewportRef.current,
          { opacity: 0, scale: 0.88, rotation: -9 },
          { opacity: 1, scale: 1, rotation: -9, duration: 0.8, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          heroHeadingsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo(
          sideIndicatorRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );
    },
    { dependencies: [isLoaded], scope: containerRef }
  );

  // ---------------------------------------------------------------------------
  // GSAP ScrollTrigger Sequence across the Story Track
  // ---------------------------------------------------------------------------
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (!storyTrackRef.current || !bottleViewportRef.current) return;

      const totalFrames = 89; // 0 to 89

      // 1. Tilt on hero that straightens to 0deg as user scrolls into Intro
      if (!prefersReducedMotion) {
        gsap.fromTo(
          bottleViewportRef.current,
          { rotation: -9 },
          {
            rotation: 0,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: storyTrackRef.current,
              start: 'top top',
              end: 'top -300',
              scrub: 1,
            },
          }
        );
      }

      // 2. Scrub Lottie animation: completes 360deg rotation when Awards reaches bottom
      const awardsEl = document.getElementById('awards');
      ScrollTrigger.create({
        trigger: storyTrackRef.current,
        start: 'top top',
        endTrigger: awardsEl || storyTrackRef.current,
        end: awardsEl ? 'bottom bottom' : 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          if (animRef.current && !prefersReducedMotion) {
            const frame = self.progress * totalFrames;
            animRef.current.goToAndStop(frame, true);
          }
        },
      });

      // 3. Settle bottle 20px from bottom of awardsSection
      if (awardsEl && bottleViewportRef.current) {
        const bottle = bottleViewportRef.current;
        const GAP = 20;

        const updateBottlePosition = () => {
          if (!bottle || !awardsEl) return;

          const vh = window.innerHeight;
          const canH = bottle.offsetHeight || 400;
          const rAwards = awardsEl.getBoundingClientRect();
          const canBottomCentered = (vh + canH) / 2;
          const y = Math.min(0, rAwards.bottom - GAP - canBottomCentered);

          gsap.set(bottle, { y });
        };

        ScrollTrigger.create({
          trigger: awardsEl,
          start: 'top bottom',
          end: 'bottom top',
          invalidateOnRefresh: true,
          onUpdate: updateBottlePosition,
          onRefresh: updateBottlePosition,
          onLeaveBack: () => gsap.set(bottle, { y: 0 }),
        });
      }

      // 4. Track active section for side indicator
      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        });
      });

      const matchEl = document.getElementById('match');
      if (matchEl) {
        ScrollTrigger.create({
          trigger: matchEl,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveSection('food'),
          onEnterBack: () => setActiveSection('food'),
        });
      }
    },
    { scope: containerRef }
  );

  const headingLines = t.heading.includes('\n')
    ? t.heading.split('\n')
    : [t.heading];

  const subtitleLines = t.subtitle.includes('\n')
    ? t.subtitle.split('\n')
    : [t.subtitle];

  return (
    <div
      className={`${styles.experienceWrapper} ${!isLoaded ? styles.loadingLocked : ''}`}
      ref={containerRef}
    >
      {/* 1. Global Page Background Graphic */}
      <div
        className={`${styles.pageAnchorBackground} ${isLoaded ? styles.anchorLoaded : styles.anchorLoading}`}
        ref={anchorRef}
        aria-hidden="true"
      >
        <Image
          src={config.heroBg.src}
          alt={config.heroBg.alt || ''}
          width={config.heroBg.width}
          height={config.heroBg.height}
          priority
          className={styles.anchorSvg}
        />
      </div>

      {/* 2. Desktop Side Navigation Indicator */}
      <nav
        className={`${styles.sideIndicator} ${!isLoaded ? styles.elementHidden : ''}`}
        aria-label="Story sections"
        ref={sideIndicatorRef}
      >
        <ul className={styles.indicatorList}>
          {SECTIONS.map(({ id, label }, index) => {
            const isActive = activeSection === id;
            return (
              <li key={id} className={styles.indicatorItem}>
                <button
                  type="button"
                  className={styles.indicatorButton}
                  onClick={() => handleScrollToSection(id)}
                  aria-label={`Scroll to ${label}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span
                    className={`${styles.indicatorDot} ${isActive ? styles.indicatorDotActive : ''}`}
                  />
                  {isActive && <span className={styles.indicatorRing} />}
                </button>
                {index < SECTIONS.length - 1 && (
                  <span className={styles.indicatorLine} aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* -------------------------------------------------------------------- */}
      {/* Interactive Story Track (Intro through Awards)                         */}
      {/* -------------------------------------------------------------------- */}
      <div className={styles.storyTrack} ref={storyTrackRef}>
        {/* Sticky Lottie Stage */}
        <div className={styles.stickyStage} aria-hidden="true">
          <div
            className={`${styles.bottleViewport} ${!isLoaded ? styles.elementHidden : ''}`}
            ref={bottleViewportRef}
          >
            <div className={styles.lottieContainer} ref={lottieContainerRef} />
          </div>
        </div>

        {/* Hero Typography Shell */}
        <div className={styles.heroShell} id="hero">
          <div
            className={`${styles.heroHeadings} ${!isLoaded ? styles.elementHidden : ''}`}
            ref={heroHeadingsRef}
          >
            <div className={styles.headingLeft}>
              <Heading level="h1" as="h1">
                {headingLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < headingLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </Heading>
            </div>
            <div className={styles.headingRight}>
              <Heading level="h1" as="span">
                {subtitleLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < subtitleLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </Heading>
            </div>
          </div>
        </div>

        {/* Section 1: Intro */}
        <section className={styles.contentSection} id="intro">
          <div className={styles.contentContainer}>
            <div className={styles.introWrapper}>
              <div className={styles.introLeft}>
                <Heading level="h2" as="h2" className={styles.introTitle}>
                  {t.intro.title}
                </Heading>
              </div>
              <div className={styles.introRight}>
                <p className={styles.introText}>{t.intro.p1}</p>
                <p className={styles.introText}>{t.intro.p2}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Stats Graphic with 3 separate badges */}
        <section
          className={`${styles.contentSection} ${styles.statsSection}`}
          id="stats"
          aria-label={t.stats.ariaLabel}
        >
          <div className={styles.contentContainer}>
            <div className={styles.statsBadgesWrapper}>
              <div className={`${styles.badgeItem} ${styles.badgeIpa}`}>
                <Image
                  src={config.badges.ipa.src}
                  alt={config.badges.ipa.alt}
                  width={config.badges.ipa.width}
                  height={config.badges.ipa.height}
                  priority
                />
              </div>
              <div className={`${styles.badgeItem} ${styles.badgeAlc}`}>
                <Image
                  src={config.badges.alc.src}
                  alt={config.badges.alc.alt}
                  width={config.badges.alc.width}
                  height={config.badges.alc.height}
                  priority
                />
              </div>
              <div className={`${styles.badgeItem} ${styles.badgePlato}`}>
                <Image
                  src={config.badges.plato.src}
                  alt={config.badges.plato.alt}
                  width={config.badges.plato.width}
                  height={config.badges.plato.height}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Tastometer */}
        <section
          className={`${styles.contentSection} ${styles.tastometerSection}`}
          id="tastometer"
        >
          <div className={styles.contentContainer}>
            <div className={styles.tastometerGrid}>
              <div className={styles.tastometerLeft}>
                <div className={styles.tastecardDesktop}>
                  <Image
                    src={config.tastometer.desktopSrc}
                    alt={config.tastometer.alt}
                    width={486}
                    height={512}
                  />
                </div>
                <div className={styles.tastecardMobile}>
                  <Image
                    src={config.tastometer.mobileSrc}
                    alt={config.tastometer.alt}
                    width={358}
                    height={331}
                  />
                </div>
              </div>

              <div className={styles.tastometerRight}>
                <div className={styles.tastometerItem}>
                  <Heading level="h4" as="h3">
                    {t.tastometer.hopsTitle}
                  </Heading>
                  <p className={styles.paramValue}>{t.tastometer.hopsValue}</p>
                </div>
                <div className={styles.tastometerItem}>
                  <Heading level="h4" as="h3">
                    {t.tastometer.maltTitle}
                  </Heading>
                  <p className={styles.paramValue}>{t.tastometer.maltValue}</p>
                </div>
                <div className={styles.tastometerItem}>
                  <Heading level="h4" as="h3">
                    {t.tastometer.colorTitle}
                  </Heading>
                  <p className={styles.paramValue}>{t.tastometer.colorValue}</p>
                </div>
                <div className={styles.tastometerItem}>
                  <Heading level="h4" as="h3">
                    {t.tastometer.tempTitle}
                  </Heading>
                  <p className={styles.paramValue}>{t.tastometer.tempValue}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Match */}
        <section className={styles.contentSection} id="match">
          <div className={styles.contentContainer}>
            <div className={styles.matchGrid}>
              <div className={styles.matchRowLeft}>
                <div className={styles.matchCard}>
                  <Heading level="h2" as="h2">
                    {t.match.tasteTitle}
                  </Heading>
                  <p className={styles.matchText}>{t.match.tasteText}</p>
                </div>
              </div>

              <div className={styles.matchRowRight}>
                <div className={styles.matchCard}>
                  <Heading level="h2" as="h2">
                    {t.match.drinkWithTitle}
                  </Heading>
                  <p className={styles.matchText}>{t.match.drinkWithText}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Food Graphic */}
        <section
          className={`${styles.contentSection} ${styles.foodSection}`}
          id="food"
          aria-label={t.food.ariaLabel}
        >
          <div className={styles.contentContainer}>
            <div
              className={`${styles.foodGrid} ${reverseFoodOnMobile ? styles.foodGridReversed : ''}`}
            >
              <div className={styles.foodItemLeft}>
                <Image
                  src={config.food.itemLeft.src}
                  alt={config.food.itemLeft.alt}
                  width={config.food.itemLeft.width}
                  height={config.food.itemLeft.height}
                  className={styles.foodImageLeft}
                />
              </div>
              <div className={styles.foodItemRight}>
                <Image
                  src={config.food.itemRight.src}
                  alt={config.food.itemRight.alt}
                  width={config.food.itemRight.width}
                  height={config.food.itemRight.height}
                  className={styles.foodImageRight}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Awards */}
        <section
          className={`${styles.contentSection} ${styles.awardsSection}`}
          id="awards"
          aria-label={t.awards.ariaLabel}
        >
          <div className={styles.contentContainer}>
            <div className={styles.awardsGrid}>
              <div className={styles.awardsLeft}>
                <Heading level="h3" as="h2" className={styles.awardsTitle}>
                  {t.awards.title}
                </Heading>
              </div>
              <div className={styles.awardsRight}>
                <div className={styles.awardsList}>
                  {config.awards.map((award) => (
                    <div key={award.id} className={styles.awardItem}>
                      <Image
                        src={award.src}
                        alt={award.alt}
                        width={award.width}
                        height={award.height}
                        className={styles.awardImage}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Section 7: Shop (Outside the Bottle Track - Bottle does not enter)      */}
      {/* -------------------------------------------------------------------- */}
      <section className={styles.shopSection} id="shop">
        <div className={styles.shopWrapper}>
          <Heading level="h1" as="h2" className={styles.shopHeading}>
            {t.shop.heading}
          </Heading>
          <Button
            href={t.shop.url}
            variant="primary"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.shopButton}
          >
            {t.shop.button}
          </Button>
        </div>
      </section>
    </div>
  );
}

