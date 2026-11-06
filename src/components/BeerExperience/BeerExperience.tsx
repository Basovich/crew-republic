'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
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

type SideIndicatorKey =
  | 'ahoy'
  | 'howdy'
  | 'cheers'
  | 'story'
  | 'specs'
  | 'taste'
  | 'pairing'
  | 'awards'
  | 'shop'
  | 'stock';

function isSideIndicatorKey(key: string): key is SideIndicatorKey {
  return [
    'ahoy',
    'howdy',
    'cheers',
    'story',
    'specs',
    'taste',
    'pairing',
    'awards',
    'shop',
    'stock',
  ].includes(key);
}

export function BeerExperience({
  config,
  t,
  reverseFoodOnMobile = false,
}: BeerExperienceProps) {
  const tIndicator = useTranslations('Navigation.sideIndicator');
  const heroKey = (config.heroIndicatorLabel || 'ahoy').toLowerCase();
  const heroLabel = isSideIndicatorKey(heroKey)
    ? tIndicator(heroKey)
    : config.heroIndicatorLabel?.toUpperCase() || 'AHOY';

  const shopKey = (config.shopIndicatorLabel || 'shop').toLowerCase();
  const shopLabel = isSideIndicatorKey(shopKey)
    ? tIndicator(shopKey)
    : config.shopIndicatorLabel?.toUpperCase() || 'SHOP';

  const heroRotation = config.heroRotation ?? -9;
  const totalFrames = config.totalFrames ?? 89;

  const sections = [
    { id: 'hero', label: heroLabel },
    { id: 'intro', label: tIndicator('story') },
    { id: 'stats', label: tIndicator('specs') },
    { id: 'tastometer', label: tIndicator('taste') },
    ...(config.food ? [{ id: 'food', label: tIndicator('pairing') }] : []),
    { id: 'awards', label: tIndicator('awards') },
    { id: 'shop', label: shopLabel },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const storyTrackRef = useRef<HTMLDivElement>(null);
  const bottleTrackRef = useRef<HTMLDivElement>(null);
  const stickyStageRef = useRef<HTMLDivElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const bottleViewportRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const heroHeadingsRef = useRef<HTMLDivElement>(null);
  const sideIndicatorRef = useRef<HTMLElement>(null);
  const shopButtonRef = useRef<HTMLDivElement>(null);
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
          gsap.set(bottleViewportRef.current, { opacity: 1, rotation: heroRotation });
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
          { opacity: 0, scale: 0.88, rotation: heroRotation },
          { opacity: 1, scale: 1, rotation: heroRotation, duration: 0.8, ease: 'power2.out' },
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

      const GAP = 20;

      // 1. Tilt on hero that stays at heroRotation (-9deg) all the way down,
      //    and smoothly straightens to 0deg only as the can parks in the bottom shop section.
      if (!prefersReducedMotion && heroRotation !== 0) {
        gsap.fromTo(
          bottleViewportRef.current,
          { rotation: heroRotation },
          {
            rotation: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: shopButtonRef.current || '#shop',
              start: 'top 95%',
              end: () => {
                if (!bottleViewportRef.current || !shopButtonRef.current) return 'top 50%';
                const stageH = stickyStageRef.current?.offsetHeight || window.innerHeight;
                const canH = bottleViewportRef.current.offsetHeight || 400;
                const canBottomCentered = (stageH + canH) / 2;
                return `top ${Math.round(canBottomCentered + GAP)}px`;
              },
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // 2. Size the absolute bottleTrack so native CSS sticky unsticks and parks
      //    the bottle/glass exactly 20px above the shop button (and never moves further).
      const syncBottleTrackHeight = () => {
        const storyTrack = storyTrackRef.current;
        const bottleTrack = bottleTrackRef.current;
        const stickyStage = stickyStageRef.current;
        const bottle = bottleViewportRef.current;
        const shopBtn = shopButtonRef.current;
        if (!storyTrack || !bottleTrack || !stickyStage || !bottle || !shopBtn) return;

        const trackRect = storyTrack.getBoundingClientRect();
        const btnRect = shopBtn.getBoundingClientRect();
        const buttonTopInTrack = btnRect.top - trackRect.top;

        const stageH = stickyStage.offsetHeight || window.innerHeight;
        const canH = bottle.offsetHeight || 400;

        const trackHeight = Math.max(
          stageH,
          buttonTopInTrack - GAP + (stageH - canH) / 2
        );
        bottleTrack.style.height = `${trackHeight}px`;
      };

      syncBottleTrackHeight();
      ScrollTrigger.addEventListener('refreshInit', syncBottleTrackHeight);

      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          syncBottleTrackHeight();
        });
        if (storyTrackRef.current) resizeObserver.observe(storyTrackRef.current);
        if (stickyStageRef.current) resizeObserver.observe(stickyStageRef.current);
        if (bottleViewportRef.current) resizeObserver.observe(bottleViewportRef.current);
        if (shopButtonRef.current) resizeObserver.observe(shopButtonRef.current);
      }

      // 3. Scrub Lottie animation: completes 360deg rotation when bottle settles 20px above shop button
      ScrollTrigger.create({
        trigger: storyTrackRef.current,
        start: 'top top',
        endTrigger: shopButtonRef.current || storyTrackRef.current,
        end: () => {
          if (!bottleViewportRef.current || !shopButtonRef.current) return 'bottom bottom';
          const stageH = stickyStageRef.current?.offsetHeight || window.innerHeight;
          const canH = bottleViewportRef.current.offsetHeight || 400;
          const canBottomCentered = (stageH + canH) / 2;
          return `top ${Math.round(canBottomCentered + GAP)}px`;
        },
        invalidateOnRefresh: true,
        scrub: 1,
        onUpdate: (self) => {
          if (animRef.current && !prefersReducedMotion) {
            const frame = self.progress * totalFrames;
            animRef.current.goToAndStop(frame, true);
          }
        },
      });

      // 4. Track active section for side indicator
      sections.forEach(({ id }) => {
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

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', syncBottleTrackHeight);
        resizeObserver?.disconnect();
      };
    },
    { scope: containerRef }
  );

  // ---------------------------------------------------------------------------
  // Multi-Plane Editorial Parallax & Desktop Cursor Micro-Interactions
  // ---------------------------------------------------------------------------
  useGSAP(
    () => {
      const root = containerRef.current;
      const track = storyTrackRef.current;
      if (!root || !track) return;

      interface DepthLayerConfig {
        target: Element | null;
        trigger: Element | null;
        yFrom: number;
        yTo: number;
        xFrom?: number;
        xExit?: number;
        rotateFrom?: number;
        rotateTo?: number;
        scaleFrom?: number;
        scaleExit?: number;
        enterDelay?: number;
        scrub?: number;
      }

      const createDepthLayer = ({
        target,
        trigger,
        yFrom,
        yTo,
        xFrom = 0,
        xExit = 0,
        rotateFrom = 0,
        rotateTo = 0,
        scaleFrom = 0.94,
        scaleExit = 0.96,
        enterDelay = 0,
        scrub = 0.75,
      }: DepthLayerConfig) => {
        if (!target || !trigger) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: 'top 82%',
            end: 'bottom top',
            scrub,
          },
        });

        tl.fromTo(
          target,
          { y: yFrom, rotation: rotateFrom },
          { y: yTo, rotation: rotateTo, duration: 1, ease: 'none' },
          0
        )
          .fromTo(
            target,
            { opacity: 0, scale: scaleFrom, x: xFrom },
            {
              opacity: 1,
              scale: 1,
              x: 0,
              duration: Math.max(0.2, 0.36 - enterDelay),
              ease: 'power2.out',
            },
            enterDelay
          )
          .to(
            target,
            {
              opacity: 0.2,
              scale: scaleExit,
              x: xExit,
              duration: 0.3,
              ease: 'power2.in',
            },
            0.7
          );
      };

      const createScrubReveal = (
        trigger: Element | null,
        target: Element | null,
        options?: { yFrom?: number; start?: string; end?: string; scrub?: number }
      ) => {
        if (!trigger || !target) return;
        const {
          yFrom = 64,
          start = 'top 88%',
          end = '+=240',
          scrub = 0.45,
        } = options ?? {};

        gsap.fromTo(
          target,
          { y: yFrom, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger,
              start,
              end,
              scrub,
            },
          }
        );
      };

      const mm = gsap.matchMedia();

      // Subtle background watermark Z-depth drift across the entire story track
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const watermark = root.querySelector('[data-parallax="bg-watermark"]');
        if (watermark) {
          gsap.fromTo(
            watermark,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: 'none',
              scrollTrigger: {
                trigger: track,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
              },
            }
          );
        }
      });

      // Desktop Multi-Plane Choreography (min-width: 1024px)
      mm.add(
        '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        () => {
          // 1. Intro — Scrubbed Sequential Slide-Up (StorySection style)
          createScrubReveal(
            root.querySelector('[data-parallax="intro-left"]'),
            root.querySelector('[data-parallax="intro-title"]'),
            { start: 'top 88%' }
          );

          const introPSlots = root.querySelectorAll('[data-parallax="intro-p-slot"]');
          introPSlots.forEach((slot, idx) => {
            createScrubReveal(
              slot,
              slot.querySelector('[data-parallax="intro-p"]'),
              { start: idx === 0 ? 'top 84%' : 'top 88%' }
            );
          });

          // 2. Stats — Zero-Gravity Orbital Bottle-Cap Stamps
          const statsSection = root.querySelector('[data-parallax="stats-section"]');
          createDepthLayer({
            target: root.querySelector('[data-parallax="badge-ipa"]'),
            trigger: statsSection,
            yFrom: 70,
            yTo: -90,
            xFrom: 46,
            xExit: -14,
            rotateFrom: -14,
            rotateTo: 8,
            scaleFrom: 0.82,
          });
          createDepthLayer({
            target: root.querySelector('[data-parallax="badge-alc"]'),
            trigger: statsSection,
            yFrom: 112,
            yTo: -112,
            xFrom: -50,
            xExit: 16,
            rotateFrom: 16,
            rotateTo: -10,
            scaleFrom: 0.82,
            enterDelay: 0.04,
          });
          createDepthLayer({
            target: root.querySelector('[data-parallax="badge-plato"]'),
            trigger: statsSection,
            yFrom: 138,
            yTo: -76,
            xFrom: 42,
            xExit: -12,
            rotateFrom: -12,
            rotateTo: 9,
            scaleFrom: 0.82,
            enterDelay: 0.08,
          });

          // 3. Tastometer — Scrubbed Sequential Slide-Up per Visible Block
          createScrubReveal(
            root.querySelector('[data-parallax="taste-left"]'),
            root.querySelector('[data-parallax="taste-card"]'),
            { start: 'top 88%' }
          );

          const tasteItems = root.querySelectorAll('[data-parallax="taste-item"]');
          tasteItems.forEach((slot, idx) => {
            createScrubReveal(
              slot,
              slot.querySelector('[data-parallax="taste-item-inner"]'),
              { start: idx === 0 ? 'top 84%' : 'top 88%' }
            );
          });

          // 4. Match — Scrubbed Sequential Slide-Up per Card
          createScrubReveal(
            root.querySelector('[data-parallax="match-row-left"]'),
            root.querySelector('[data-parallax="match-left"]'),
            { start: 'top 88%' }
          );
          createScrubReveal(
            root.querySelector('[data-parallax="match-row-right"]'),
            root.querySelector('[data-parallax="match-right"]'),
            { start: 'top 86%' }
          );

          // 5. Food — Tactile Polaroid Fan-Out
          const foodSection = root.querySelector('[data-parallax="food-section"]');
          if (foodSection) {
            createDepthLayer({
              target: root.querySelector('[data-parallax="food-left"]'),
              trigger: foodSection,
              yFrom: 86,
              yTo: -68,
              xFrom: 52,
              xExit: -16,
              rotateFrom: 4,
              rotateTo: -2.8,
              scaleFrom: 0.9,
            });
            createDepthLayer({
              target: root.querySelector('[data-parallax="food-right"]'),
              trigger: foodSection,
              yFrom: 136,
              yTo: -96,
              xFrom: -52,
              xExit: 16,
              rotateFrom: -4,
              rotateTo: 2.8,
              scaleFrom: 0.9,
              enterDelay: 0.05,
            });
          }

          // 6. Awards — Scrubbed Sequential Slide-Up with Transform & Opacity
          createScrubReveal(
            root.querySelector('[data-parallax="awards-left"]'),
            root.querySelector('[data-parallax="awards-title"]'),
            { start: 'top 88%' }
          );

          const awardItems = root.querySelectorAll('[data-parallax="award-item"]');
          awardItems.forEach((item, idx) => {
            const parent = item.parentElement;
            const colStart =
              awardItems.length === 1
                ? 'top 84%'
                : idx % 2 === 0
                  ? 'top 88%'
                  : 'top 83%';
            createScrubReveal(parent || item, item, { start: colStart });
          });
        }
      );

      // Desktop Pointer Magnetism for Orbital Stamps & Polaroids
      mm.add(
        '(min-width: 1024px) and (any-hover: hover) and (prefers-reduced-motion: no-preference)',
        () => {
          const cleanups: Array<() => void> = [];

          const statsEl = root.querySelector<HTMLElement>(
            '[data-parallax="stats-section"]'
          );
          const ipaImg = root.querySelector('[data-parallax="badge-ipa-img"]');
          const alcImg = root.querySelector('[data-parallax="badge-alc-img"]');
          const platoImg = root.querySelector('[data-parallax="badge-plato-img"]');

          if (statsEl && ipaImg && alcImg && platoImg) {
            const ipaX = gsap.quickTo(ipaImg, 'x', { duration: 0.6, ease: 'power3.out' });
            const ipaY = gsap.quickTo(ipaImg, 'y', { duration: 0.6, ease: 'power3.out' });
            const alcX = gsap.quickTo(alcImg, 'x', { duration: 0.65, ease: 'power3.out' });
            const alcY = gsap.quickTo(alcImg, 'y', { duration: 0.65, ease: 'power3.out' });
            const platoX = gsap.quickTo(platoImg, 'x', { duration: 0.7, ease: 'power3.out' });
            const platoY = gsap.quickTo(platoImg, 'y', { duration: 0.7, ease: 'power3.out' });

            const onStatsMove = (e: MouseEvent) => {
              const rect = statsEl.getBoundingClientRect();
              const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
              const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
              ipaX(nx * 14);
              ipaY(ny * 12);
              alcX(nx * -18);
              alcY(ny * 15);
              platoX(nx * 10);
              platoY(ny * -11);
            };

            const onStatsLeave = () => {
              ipaX(0);
              ipaY(0);
              alcX(0);
              alcY(0);
              platoX(0);
              platoY(0);
            };

            statsEl.addEventListener('mousemove', onStatsMove);
            statsEl.addEventListener('mouseleave', onStatsLeave);
            cleanups.push(() => {
              statsEl.removeEventListener('mousemove', onStatsMove);
              statsEl.removeEventListener('mouseleave', onStatsLeave);
            });
          }

          const foodEl = root.querySelector<HTMLElement>(
            '[data-parallax="food-section"]'
          );
          const foodLeftImg = root.querySelector('[data-parallax="food-left-img"]');
          const foodRightImg = root.querySelector('[data-parallax="food-right-img"]');

          if (foodEl && foodLeftImg && foodRightImg) {
            const leftX = gsap.quickTo(foodLeftImg, 'x', { duration: 0.7, ease: 'power3.out' });
            const leftY = gsap.quickTo(foodLeftImg, 'y', { duration: 0.7, ease: 'power3.out' });
            const leftR = gsap.quickTo(foodLeftImg, 'rotation', { duration: 0.7, ease: 'power3.out' });
            const rightX = gsap.quickTo(foodRightImg, 'x', { duration: 0.75, ease: 'power3.out' });
            const rightY = gsap.quickTo(foodRightImg, 'y', { duration: 0.75, ease: 'power3.out' });
            const rightR = gsap.quickTo(foodRightImg, 'rotation', { duration: 0.75, ease: 'power3.out' });

            const onFoodMove = (e: MouseEvent) => {
              const rect = foodEl.getBoundingClientRect();
              const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
              const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
              leftX(nx * 12);
              leftY(ny * 10);
              leftR(nx * 1.4);
              rightX(nx * -14);
              rightY(ny * -10);
              rightR(nx * -1.4);
            };

            const onFoodLeave = () => {
              leftX(0);
              leftY(0);
              leftR(0);
              rightX(0);
              rightY(0);
              rightR(0);
            };

            foodEl.addEventListener('mousemove', onFoodMove);
            foodEl.addEventListener('mouseleave', onFoodLeave);
            cleanups.push(() => {
              foodEl.removeEventListener('mousemove', onFoodMove);
              foodEl.removeEventListener('mouseleave', onFoodLeave);
            });
          }

          return () => {
            cleanups.forEach((fn) => fn());
          };
        }
      );

      // Mobile / Tablet Reveal & Calibrated Parallax (max-width: 1023px)
      mm.add(
        '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
        () => {
          const mobileOpts = { yFrom: 40, start: 'top 90%', end: '+=200', scrub: 0.45 };

          createScrubReveal(
            root.querySelector('[data-parallax="intro-left"]'),
            root.querySelector('[data-parallax="intro-title"]'),
            mobileOpts
          );

          root.querySelectorAll('[data-parallax="intro-p-slot"]').forEach((slot) => {
            createScrubReveal(
              slot,
              slot.querySelector('[data-parallax="intro-p"]'),
              mobileOpts
            );
          });

          createScrubReveal(
            root.querySelector('[data-parallax="taste-left"]'),
            root.querySelector('[data-parallax="taste-card"]'),
            mobileOpts
          );

          root.querySelectorAll('[data-parallax="taste-item"]').forEach((slot) => {
            createScrubReveal(
              slot,
              slot.querySelector('[data-parallax="taste-item-inner"]'),
              mobileOpts
            );
          });

          createScrubReveal(
            root.querySelector('[data-parallax="match-row-left"]'),
            root.querySelector('[data-parallax="match-left"]'),
            mobileOpts
          );
          createScrubReveal(
            root.querySelector('[data-parallax="match-row-right"]'),
            root.querySelector('[data-parallax="match-right"]'),
            mobileOpts
          );

          createScrubReveal(
            root.querySelector('[data-parallax="awards-left"]'),
            root.querySelector('[data-parallax="awards-title"]'),
            mobileOpts
          );

          const mobileAwards = root.querySelectorAll('[data-parallax="award-item"]');
          mobileAwards.forEach((el) => {
            const parent = el.parentElement;
            if (parent && window.getComputedStyle(parent).display === 'none') return;
            createScrubReveal(parent || el, el, mobileOpts);
          });

          const statsSection = root.querySelector('[data-parallax="stats-section"]');
          createDepthLayer({
            target: root.querySelector('[data-parallax="badge-ipa"]'),
            trigger: statsSection,
            yFrom: 36,
            yTo: -42,
            rotateFrom: -8,
            rotateTo: 5,
            scaleFrom: 0.88,
            scrub: 0.6,
          });
          createDepthLayer({
            target: root.querySelector('[data-parallax="badge-alc"]'),
            trigger: statsSection,
            yFrom: 54,
            yTo: -54,
            rotateFrom: 9,
            rotateTo: -6,
            scaleFrom: 0.88,
            scrub: 0.6,
          });
          createDepthLayer({
            target: root.querySelector('[data-parallax="badge-plato"]'),
            trigger: statsSection,
            yFrom: 68,
            yTo: -38,
            rotateFrom: -7,
            rotateTo: 6,
            scaleFrom: 0.88,
            scrub: 0.6,
          });

          const foodLeft = root.querySelector('[data-parallax="food-left"]');
          const foodRight = root.querySelector('[data-parallax="food-right"]');
          if (foodLeft) {
            createDepthLayer({
              target: foodLeft,
              trigger: foodLeft,
              yFrom: 42,
              yTo: -42,
              rotateFrom: 2.5,
              rotateTo: -1.8,
              scaleFrom: 0.94,
              scrub: 0.6,
            });
          }
          if (foodRight) {
            createDepthLayer({
              target: foodRight,
              trigger: foodRight,
              yFrom: 48,
              yTo: -48,
              rotateFrom: -2.5,
              rotateTo: 1.8,
              scaleFrom: 0.94,
              scrub: 0.6,
            });
          }
        }
      );

      return () => {
        mm.revert();
      };
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
          data-parallax="bg-watermark"
        />
      </div>

      {/* 2. Desktop Side Navigation Indicator */}
      <nav
        className={`${styles.sideIndicator} ${!isLoaded ? styles.elementHidden : ''}`}
        aria-label="Story sections"
        ref={sideIndicatorRef}
      >
        <ul className={styles.indicatorList}>
          {sections.map(({ id, label }, index) => {
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
                  <span className={styles.indicatorLabel} aria-hidden="true">
                    {label}
                  </span>
                </button>
                {index < sections.length - 1 && (
                  <span className={styles.indicatorLine} aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* -------------------------------------------------------------------- */}
      {/* Interactive Story Track (Intro through Shop)                           */}
      {/* -------------------------------------------------------------------- */}
      <div className={styles.storyTrack} ref={storyTrackRef}>
        {/* Sticky Lottie Stage inside explicit track that ends 20px above shop button */}
        <div className={styles.bottleTrack} ref={bottleTrackRef} aria-hidden="true">
          <div className={styles.stickyStage} ref={stickyStageRef}>
            <div
              className={`${styles.bottleViewport} ${!isLoaded ? styles.elementHidden : ''}`}
              ref={bottleViewportRef}
              style={{ transform: `rotate(${heroRotation}deg)` }}
            >
              <div className={styles.lottieContainer} ref={lottieContainerRef} />
            </div>
          </div>
        </div>

        {/* Hero Typography Shell */}
        <div
          className={`${styles.heroShell} ${config.slug === 'drunken-sailor' ? (styles.heroShellDrunkenSailor || '') : ''} ${config.heroShellClassName || ''}`.replace(/\s+/g, ' ').trim()}
          id="hero"
        >
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
        <section className={styles.contentSection} id="intro" data-parallax="intro-section">
          <div className={styles.contentContainer}>
            <div className={styles.introWrapper}>
              <div className={styles.introLeft} data-parallax="intro-left">
                <Heading
                  level="h2"
                  as="h2"
                  className={styles.introTitle}
                  data-parallax="intro-title"
                >
                  {t.intro.title}
                </Heading>
              </div>
              <div className={styles.introRight} data-parallax="intro-right">
                <div className={styles.introTextSlot} data-parallax="intro-p-slot">
                  <p className={styles.introText} data-parallax="intro-p">
                    {t.intro.p1}
                  </p>
                </div>
                <div className={styles.introTextSlot} data-parallax="intro-p-slot">
                  <p className={styles.introText} data-parallax="intro-p">
                    {t.intro.p2}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Stats Graphic with 3 separate badges */}
        <section
          className={`${styles.contentSection} ${styles.statsSection}`}
          id="stats"
          aria-label={t.stats.ariaLabel}
          data-parallax="stats-section"
        >
          <div className={styles.contentContainer}>
            <div className={styles.statsBadgesWrapper}>
              <div className={`${styles.badgeItem} ${styles.badgeIpa}`}>
                <div className={styles.badgeParallax} data-parallax="badge-ipa">
                  <Image
                    src={config.badges.ipa.src}
                    alt={config.badges.ipa.alt}
                    width={config.badges.ipa.width}
                    height={config.badges.ipa.height}
                    priority
                    data-parallax="badge-ipa-img"
                  />
                </div>
              </div>
              <div className={`${styles.badgeItem} ${styles.badgeAlc}`}>
                <div className={styles.badgeParallax} data-parallax="badge-alc">
                  <Image
                    src={config.badges.alc.src}
                    alt={config.badges.alc.alt}
                    width={config.badges.alc.width}
                    height={config.badges.alc.height}
                    priority
                    data-parallax="badge-alc-img"
                  />
                </div>
              </div>
              <div className={`${styles.badgeItem} ${styles.badgePlato}`}>
                <div className={styles.badgeParallax} data-parallax="badge-plato">
                  <Image
                    src={config.badges.plato.src}
                    alt={config.badges.plato.alt}
                    width={config.badges.plato.width}
                    height={config.badges.plato.height}
                    priority
                    data-parallax="badge-plato-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Tastometer */}
        <section
          className={`${styles.contentSection} ${styles.tastometerSection}`}
          id="tastometer"
          data-parallax="taste-section"
        >
          <div className={styles.contentContainer}>
            <div className={styles.tastometerGrid}>
              <div className={styles.tastometerLeft} data-parallax="taste-left">
                <div className={styles.tastometerCardWrap} data-parallax="taste-card">
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
              </div>

              <div className={styles.tastometerRight}>
                <div className={styles.tastometerItem} data-parallax="taste-item">
                  <div
                    className={styles.tastometerItemInner}
                    data-parallax="taste-item-inner"
                  >
                    <Heading level="h4" as="h3">
                      {t.tastometer.hopsTitle}
                    </Heading>
                    <p className={styles.paramValue}>{t.tastometer.hopsValue}</p>
                  </div>
                </div>
                <div className={styles.tastometerItem} data-parallax="taste-item">
                  <div
                    className={styles.tastometerItemInner}
                    data-parallax="taste-item-inner"
                  >
                    <Heading level="h4" as="h3">
                      {t.tastometer.maltTitle}
                    </Heading>
                    <p className={styles.paramValue}>{t.tastometer.maltValue}</p>
                  </div>
                </div>
                <div className={styles.tastometerItem} data-parallax="taste-item">
                  <div
                    className={styles.tastometerItemInner}
                    data-parallax="taste-item-inner"
                  >
                    <Heading level="h4" as="h3">
                      {t.tastometer.colorTitle}
                    </Heading>
                    <p className={styles.paramValue}>{t.tastometer.colorValue}</p>
                  </div>
                </div>
                <div className={styles.tastometerItem} data-parallax="taste-item">
                  <div
                    className={styles.tastometerItemInner}
                    data-parallax="taste-item-inner"
                  >
                    <Heading level="h4" as="h3">
                      {t.tastometer.tempTitle}
                    </Heading>
                    <p className={styles.paramValue}>{t.tastometer.tempValue}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Match */}
        <section className={styles.contentSection} id="match" data-parallax="match-section">
          <div className={styles.contentContainer}>
            <div className={styles.matchGrid}>
              <div className={styles.matchRowLeft} data-parallax="match-row-left">
                <div className={styles.matchCard} data-parallax="match-left">
                  <Heading level="h2" as="h2">
                    {t.match.tasteTitle}
                  </Heading>
                  <p className={styles.matchText}>{t.match.tasteText}</p>
                </div>
              </div>

              <div className={styles.matchRowRight} data-parallax="match-row-right">
                <div className={styles.matchCard} data-parallax="match-right">
                  <Heading level="h2" as="h2">
                    {t.match.drinkWithTitle}
                  </Heading>
                  <p className={styles.matchText}>{t.match.drinkWithText}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Food Graphic (optional) */}
        {config.food && (
          <section
            className={`${styles.contentSection} ${styles.foodSection}`}
            id="food"
            aria-label={t.food?.ariaLabel}
            data-parallax="food-section"
          >
            <div className={styles.contentContainer}>
              <div
                className={`${styles.foodGrid} ${reverseFoodOnMobile ? styles.foodGridReversed : ''}`}
              >
                <div className={styles.foodItemLeft}>
                  <div className={styles.foodParallax} data-parallax="food-left">
                    <Image
                      src={config.food.itemLeft.src}
                      alt={config.food.itemLeft.alt}
                      width={config.food.itemLeft.width}
                      height={config.food.itemLeft.height}
                      className={styles.foodImageLeft}
                      data-parallax="food-left-img"
                    />
                  </div>
                </div>
                <div className={styles.foodItemRight}>
                  <div className={styles.foodParallax} data-parallax="food-right">
                    <Image
                      src={config.food.itemRight.src}
                      alt={config.food.itemRight.alt}
                      width={config.food.itemRight.width}
                      height={config.food.itemRight.height}
                      className={styles.foodImageRight}
                      data-parallax="food-right-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 6: Awards */}
        <section
          className={`${styles.contentSection} ${styles.awardsSection}`}
          id="awards"
          aria-label={t.awards.ariaLabel}
        >
          <div className={styles.contentContainer}>
            <div className={styles.awardsGrid}>
              <div className={styles.awardsLeft} data-parallax="awards-left">
                <Heading
                  level="h3"
                  as="h2"
                  className={styles.awardsTitle}
                  data-parallax="awards-title"
                >
                  {t.awards.title}
                </Heading>
              </div>
              <div className={styles.awardsRight}>
                <div className={styles.awardsList}>
                  {config.awards.map((award) => (
                    <div key={award.id} className={styles.awardItem}>
                      <div className={styles.awardReveal} data-parallax="award-item">
                        <Image
                          src={award.src}
                          alt={award.alt}
                          width={award.width}
                          height={award.height}
                          className={styles.awardImage}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------- */}
        {/* Section 7: Shop                                                      */}
        {/* -------------------------------------------------------------------- */}
        <section className={styles.shopSection} id="shop">
          <div
            className={`${styles.shopWrapper} ${config.slug === 'fireside' ? (styles.shopWrapperFireside || '') : ''} ${config.shopWrapperClassName || ''}`.replace(/\s+/g, ' ').trim()}
          >
            <Heading level="h1" as="h2" className={styles.shopHeading}>
              {t.shop.heading}
            </Heading>
            <div className={styles.shopButtonWrapper} ref={shopButtonRef}>
              {(() => {
                const isExternal = t.shop.url.startsWith('http');
                return (
                  <Button
                    href={t.shop.url}
                    variant="primary"
                    size="lg"
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className={styles.shopButton}
                  >
                    {t.shop.button}
                  </Button>
                );
              })()}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

