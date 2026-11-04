'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { AnimationItem } from 'lottie-web';
import { Heading } from '@/components/Heading';
import { Button } from '@/components/Button/Button';
import styles from './DrunkenSailor.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface DrunkenSailorExperienceProps {
  t: {
    heading: string;
    subtitle: string;
    intro: {
      title: string;
      p1: string;
      p2: string;
    };
    stats: {
      ariaLabel: string;
    };
    tastometer: {
      hopsTitle: string;
      hopsValue: string;
      maltTitle: string;
      maltValue: string;
      colorTitle: string;
      colorValue: string;
      tempTitle: string;
      tempValue: string;
    };
    match: {
      tasteTitle: string;
      tasteText: string;
      drinkWithTitle: string;
      drinkWithText: string;
    };
    food: {
      ariaLabel: string;
    };
    awards: {
      title: string;
      ariaLabel: string;
    };
    shop: {
      heading: string;
      button: string;
      url: string;
    };
  };
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

export function DrunkenSailorExperience({ t }: DrunkenSailorExperienceProps) {
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
  // Lottie Animation Loading & ScrollTrigger Binding
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isCancelled = false;

    async function initLottie() {
      if (!lottieContainerRef.current) return;

      const startTime = Date.now();
      console.log(`[DrunkenSailor Loader] 🚀 initLottie started (t = 0ms)`);

      // Clean up previous container content to prevent duplicate SVG nodes in React
      lottieContainerRef.current.innerHTML = '';

      // 1. In DS_High_Angel_30.json, frame 0 uses refId 'image_89' -> image_89.webp
      const firstFrameSrc = '/images/drunken-sailor/animations/images/image_89.webp';
      const firstFrameImg = new window.Image();
      firstFrameImg.src = firstFrameSrc;

      const frame0Promise = new Promise<void>((resolve) => {
        if (firstFrameImg.complete && firstFrameImg.naturalWidth > 0) {
          console.log(`[DrunkenSailor Loader] ⚡ Frame 0 (image_89.webp) was already in cache! (${Date.now() - startTime}ms)`);
          resolve();
        } else {
          firstFrameImg.onload = () => {
            console.log(`[DrunkenSailor Loader] 📥 Frame 0 (image_89.webp) downloaded successfully in ${Date.now() - startTime}ms`);
            resolve();
          };
          firstFrameImg.onerror = (err) => {
            console.error(`[DrunkenSailor Loader] ❌ Frame 0 download failed in ${Date.now() - startTime}ms`, err);
            resolve();
          };
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

      // Ensure container is still clean before creating new animation instance
      if (lottieContainerRef.current) {
        lottieContainerRef.current.innerHTML = '';
      }

      console.log(`[DrunkenSailor Loader] ⚙️ Starting lottie.loadAnimation (${Date.now() - startTime}ms)...`);
      const anim = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: '/images/drunken-sailor/animations/DS_High_Angel_30.json',
      });

      animRef.current = anim;

      const domLoadedPromise = new Promise<void>((resolve) => {
        anim.addEventListener('DOMLoaded', () => {
          console.log(`[DrunkenSailor Loader] 🧩 Lottie DOMLoaded event fired in ${Date.now() - startTime}ms`);
          resolve();
        });
        if (anim.isLoaded) {
          console.log(`[DrunkenSailor Loader] 🧩 Lottie already isLoaded in ${Date.now() - startTime}ms`);
          resolve();
        }
      });

      const minLoaderTime = 1200; // Complete at least one full anchorPulse cycle (1.2s)
      const maxSafetyTime = 10000; // 10s safety fallback

      let isReadyHandled = false;
      const handleReady = async () => {
        if (isReadyHandled || isCancelled) return;
        isReadyHandled = true;

        // Ensure frame 0 is decoded and rendered
        try {
          if (firstFrameImg.decode) {
            await firstFrameImg.decode();
            console.log(`[DrunkenSailor Loader] 🎨 Frame 0 (image_89.webp) decoded into GPU memory in ${Date.now() - startTime}ms`);
          }
        } catch (e) {
          console.warn(`[DrunkenSailor Loader] Frame 0 decode warning:`, e);
        }

        if (animRef.current) {
          animRef.current.goToAndStop(0, true);
          console.log(`[DrunkenSailor Loader] 🎬 anim.goToAndStop(0, true) rendered frame 0 in ${Date.now() - startTime}ms`);
        }

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoaderTime - elapsed);
        console.log(`[DrunkenSailor Loader] ⏳ Remaining loader delay: ${remaining}ms (elapsed: ${elapsed}ms, min: ${minLoaderTime}ms)`);

        setTimeout(() => {
          if (isCancelled) return;
          console.log(`[DrunkenSailor Loader] ✨ DISMISSING LOADER: Setting isLoaded = true at ${Date.now() - startTime}ms! Can is fully visible!`);
          setIsLoaded(true);
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
        }, remaining);
      };

      const safetyTimer = setTimeout(() => {
        console.warn(`[DrunkenSailor Loader] ⚠️ Safety timeout triggered at ${Date.now() - startTime}ms!`);
        handleReady();
      }, maxSafetyTime);

      // Wait for both actual initial frame (image_89.webp) and Lottie DOM structure
      Promise.all([frame0Promise, domLoadedPromise]).then(() => {
        clearTimeout(safetyTimer);
        console.log(`[DrunkenSailor Loader] ✅ Frame 0 & Lottie DOM are ready! Proceeding to reveal (${Date.now() - startTime}ms)`);
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
  }, []);

  // ---------------------------------------------------------------------------
  // Entrance Transition: Expand Anchor to background and reveal content
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
        if (bottleViewportRef.current) gsap.set(bottleViewportRef.current, { opacity: 1, rotation: -9 });
        if (heroHeadingsRef.current) gsap.set(heroHeadingsRef.current, { opacity: 1, y: 0 });
        if (sideIndicatorRef.current) gsap.set(sideIndicatorRef.current, { opacity: 1 });
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

      // 1. Expand anchor from loader scale to background scale
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
        // 2. Reveal animated can (fade in, settle, preserving hero -9deg tilt)
        .fromTo(
          bottleViewportRef.current,
          { opacity: 0, scale: 0.88, rotation: -9 },
          { opacity: 1, scale: 1, rotation: -9, duration: 0.8, ease: 'power2.out' },
          '-=0.4'
        )
        // 3. Stagger/slide up hero headings
        .fromTo(
          heroHeadingsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.5'
        )
        // 4. Reveal side indicator
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

      // 2. Scrub Lottie animation: completes 360deg rotation when Awards reaches bottom and stops
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

      // 3. Settle bottle 20px from bottom of awardsSection smoothly using bottom edge trigger
      if (awardsEl && bottleViewportRef.current) {
        const bottle = bottleViewportRef.current;
        const GAP = 20; // відступ банки від низу awardsEl

        const updateBottlePosition = () => {
          if (!bottle || !awardsEl) return;

          const vh = window.innerHeight;
          const canH = bottle.offsetHeight || 400;
          const rAwards = awardsEl.getBoundingClientRect();

          // Де був би низ банки, якби вона стояла по центру
          const canBottomCentered = (vh + canH) / 2;

          // Поки низ секції далеко — y = 0 (центр).
          // Коли низ секції підходить впритул — банка їде вгору разом з ним.
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

  return (
    <div
      className={`${styles.experienceWrapper} ${!isLoaded ? styles.loadingLocked : ''}`}
      ref={containerRef}
    >
      {/* 1. Global Page Background Anchor (Loader first, then full-page background under content) */}
      <div
        className={`${styles.pageAnchorBackground} ${isLoaded ? styles.anchorLoaded : styles.anchorLoading}`}
        ref={anchorRef}
        aria-hidden="true"
      >
        <Image
          src="/images/drunken-sailor/hero-anchor-bg.svg"
          alt=""
          width={798}
          height={974}
          priority
          className={styles.anchorSvg}
        />
      </div>

      {/* 2. Desktop Side Navigation Indicator */}
      <nav
        className={`${styles.sideIndicator} ${!isLoaded ? styles.elementHidden : ''}`}
        ref={sideIndicatorRef}
        aria-label="Section navigation"
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
        {/* Sticky Lottie Stage anchored throughout this track only */}
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
                DRUNKEN
                <br />
                SAILOR
              </Heading>
            </div>
            <div className={styles.headingRight}>
              <Heading level="h1" as="span">
                INDIA
                <br />
                PALE ALE
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
                  src="/images/drunken-sailor/stats/badge-ipa.svg"
                  alt="IPA"
                  width={120}
                  height={120}
                  priority
                />
              </div>
              <div className={`${styles.badgeItem} ${styles.badgeAlc}`}>
                <Image
                  src="/images/drunken-sailor/stats/badge-alc.svg"
                  alt="ALC. 6,4% VOL"
                  width={120}
                  height={120}
                  priority
                />
              </div>
              <div className={`${styles.badgeItem} ${styles.badgePlato}`}>
                <Image
                  src="/images/drunken-sailor/stats/badge-plato.svg"
                  alt="14° PLATO"
                  width={120}
                  height={120}
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
                    src="/images/drunken-sailor/tastometer/tastecard-desktop.svg"
                    alt="Drunken Sailor Taste Card"
                    width={486}
                    height={512}
                  />
                </div>
                <div className={styles.tastecardMobile}>
                  <Image
                    src="/images/drunken-sailor/tastometer/tastecard-mobile.svg"
                    alt="Drunken Sailor Taste Card"
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
            <div className={styles.foodGrid}>
              <div className={styles.foodItemLeft}>
                <Image
                  src="/images/drunken-sailor/food/food-thai.webp"
                  alt={`${t.food.ariaLabel} - Thai cuisine`}
                  width={537}
                  height={478}
                  className={styles.foodImageThai}
                />
              </div>
              <div className={styles.foodItemRight}>
                <Image
                  src="/images/drunken-sailor/food/food-burger.webp"
                  alt={`${t.food.ariaLabel} - Steaks and burgers`}
                  width={525}
                  height={421}
                  className={styles.foodImageBurger}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Awards (Final block for the bottle animation) */}
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
                <div className={styles.awardsGraphicDesktop}>
                  <Image
                    src="/images/drunken-sailor/awards/awards-desktop.svg"
                    alt={t.awards.ariaLabel}
                    width={384}
                    height={630}
                  />
                </div>
                <div className={styles.awardsGraphicMobile}>
                  <Image
                    src="/images/drunken-sailor/awards/awards-mobile.svg"
                    alt={t.awards.ariaLabel}
                    width={80}
                    height={528}
                  />
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
          <Heading level="h1" as="h2" className={styles.shopHeadline}>
            {t.shop.heading}
          </Heading>

          <Button
            variant="primary"
            size="giant"
            href={t.shop.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.shop.button}
          </Button>
        </div>
      </section>
    </div>
  );
}

