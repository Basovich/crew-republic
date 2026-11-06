'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Link, usePathname } from '@/i18n/routing';
import { Heading } from '@/components/Heading';
import { Button } from '@/components/Button/Button';
import {
  AGE_GATE_CONFIG,
  hasAgeVerifiedCookie,
  setAgeVerifiedCookie,
  subscribeAgeGateStatus,
} from '@/lib/ageGate';
import styles from './AgeGate.module.scss';

gsap.registerPlugin(useGSAP);

type VerificationSnapshot = 'ssr' | 'verified' | 'unverified';

const LEGAL_EXEMPT_PATHS = new Set(['/privacy-policy', '/imprint', '/gtc']);

function getClientSnapshot(): VerificationSnapshot {
  return hasAgeVerifiedCookie() ? 'verified' : 'unverified';
}

function getServerSnapshot(): VerificationSnapshot {
  return 'ssr';
}

export function AgeGate() {
  const t = useTranslations('AgeGate');
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const status = useSyncExternalStore(
    subscribeAgeGateStatus,
    getClientSnapshot,
    getServerSnapshot
  );

  const isExemptRoute = LEGAL_EXEMPT_PATHS.has(pathname);
  const isOpen = (status === 'unverified' || isClosing) && !isExemptRoute;

  // Lock background page scroll while the gate is open
  useEffect(() => {
    if (!isOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isOpen]);

  // Initial focus and keyboard focus trap (Escape intentionally blocked)
  useEffect(() => {
    if (!isOpen) return;

    const container = overlayRef.current;
    if (!container) return;

    const primaryBtn = container.querySelector<HTMLButtonElement>(
      '[data-age-confirm="true"]'
    );
    primaryBtn?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen]);

  useGSAP(
    () => {
      if (!isOpen || isClosing) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) return;

      gsap.from('[data-age-reveal]', {
        autoAlpha: 0,
        y: 20,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
      });
    },
    { scope: overlayRef, dependencies: [isOpen] }
  );

  const handleConfirm = useCallback(() => {
    if (isClosing) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !overlayRef.current) {
      setAgeVerifiedCookie();
      return;
    }

    setIsClosing(true);
    setAgeVerifiedCookie();

    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      duration: 0.35,
      ease: 'power2.out',
      onComplete: () => {
        setIsClosing(false);
      },
    });
  }, [isClosing]);

  const handleDecline = useCallback(() => {
    window.location.assign(AGE_GATE_CONFIG.UNDERAGE_REDIRECT_URL);
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-heading"
      aria-describedby="age-gate-description"
      aria-label={t('dialogLabel')}
      data-lenis-prevent
      className={styles.overlay}
    >
      {/* Background Pouring Shot Layer */}
      <div className={styles.bgLayer} aria-hidden="true">
        <div className={styles.bgMediaWrap}>
          <Image
            src="/images/age-gate/pouring-shot.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 767px) 185vw, 55vw"
            draggable={false}
            className={styles.bgImage}
          />
        </div>
      </div>

      <div className={styles.inner}>
        {/* Top Centered Square Logo (non-interactive so age check cannot be bypassed) */}
        <div className={styles.header}>
          <Image
            src="/images/Logo-Header.svg"
            alt={t('logoAlt')}
            width={157}
            height={146}
            priority
            draggable={false}
            className={styles.logoImage}
          />
        </div>

        {/* Center Content */}
        <div className={styles.content}>
          <div data-age-reveal className={styles.headlines}>
            <Heading
              id="age-gate-heading"
              level="h1"
              as="h2"
              className={styles.headline}
            >
              {t('heading')}
            </Heading>

            <p id="age-gate-description" className={styles.description}>
              {t('description')}
            </p>
          </div>

          <div data-age-reveal className={styles.ageBlock}>
            <Heading level="h3" as="p" className={styles.question}>
              {t('question')}
            </Heading>

            <div className={styles.actions}>
              <Button
                variant="primary"
                size="lg"
                data-age-confirm="true"
                onClick={handleConfirm}
                className={styles.actionBtn}
              >
                {t('confirm')}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={handleDecline}
                className={`${styles.actionBtn} ${styles.declineBtn}`}
              >
                {t('decline')}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Cookie Usage Notice */}
        <div data-age-reveal className={styles.cookieNotice}>
          <p className={styles.cookieTitle}>{t('cookieTitle')}</p>
          <p className={styles.cookieText}>
            {t.rich('cookieText', {
              policy: (chunks) => (
                <Link href="/privacy-policy" className={styles.policyLink}>
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

