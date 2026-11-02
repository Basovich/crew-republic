'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { UsFlag, GermanFlag } from '@/components/Header/FlagIcons';
import styles from './Navigation.module.scss';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pillStyle, setPillStyle] = useState<{ top: number; height: number; opacity: number }>({
    top: 0,
    height: 0,
    opacity: 0,
  });

  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const linksListRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        setHoveredIndex(null);
        setPillStyle((p) => ({ ...p, opacity: 0 }));
      }
      return !prev;
    });
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setHoveredIndex(null);
    setPillStyle((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
        buttonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/brand-story', label: t('brandStory') },
    { href: '/drunken-sailor', label: t('drunkenSailor') },
    { href: '/jackpot', label: t('jackpot') },
    { href: '/fireside', label: t('fireside') },
    { href: '/contact', label: t('contact') },
  ];

  // Determine active link index based on pathname
  const activeIndex = Math.max(
    0,
    navLinks.findIndex((item) => item.href === pathname)
  );

  // Target index for sliding pill: hovered link if any, otherwise active link
  const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  // Update pill position based on target item
  const updatePillPosition = useCallback((index: number) => {
    const targetEl =
      itemRefs.current[index] ||
      linksListRef.current?.querySelector<HTMLElement>(`[data-nav-index="${index}"]`);

    if (targetEl) {
      setPillStyle({
        top: targetEl.offsetTop,
        height: targetEl.offsetHeight,
        opacity: 1,
      });
    }
  }, []);

  // Synchronize pill position when menu opens or target changes
  useEffect(() => {
    if (!isOpen) return;

    const rafId = requestAnimationFrame(() => {
      updatePillPosition(targetIndex);
    });
    return () => cancelAnimationFrame(rafId);
  }, [isOpen, targetIndex, updatePillPosition]);

  // Event delegation for pointer movements over menu items
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-nav-index]');
    if (target) {
      const idx = Number(target.getAttribute('data-nav-index'));
      if (!isNaN(idx) && idx !== hoveredIndex) {
        setHoveredIndex(idx);
      }
    }
  };

  const handlePointerLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <>
      {/* Fullscreen Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div className={`${styles.navContainer} ${className || ''}`} ref={menuRef}>
        {/* Fly-out Menu Card */}
        <div
          id="navigation-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-label={t('menu')}
          className={`${styles.menuCard} ${isOpen ? styles.menuCardOpen : ''}`}
        >
          <nav
            ref={linksListRef}
            className={styles.linksList}
            aria-label="Main Navigation"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            {/* Smooth Floating Pill Indicator */}
            <span
              className={styles.indicatorPill}
              style={{
                transform: `translateY(${pillStyle.top}px)`,
                height: `${pillStyle.height}px`,
                opacity: pillStyle.opacity,
              }}
              aria-hidden="true"
            />

            {navLinks.map((item, index) => {
              const isCurrentTarget = targetIndex === index;
              return (
                <Link
                  key={item.href}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  data-nav-index={index}
                  href={item.href}
                  onClick={closeMenu}
                  onPointerEnter={() => setHoveredIndex(index)}
                  className={`${styles.navItem} ${isCurrentTarget ? styles.navItemHighlighted : ''}`}
                  tabIndex={isOpen ? 0 : -1}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Embedded Language Switcher */}
          <div className={styles.langSwitch} role="group" aria-label={t('switchLanguage')}>
            <Link
              href={pathname}
              locale="en"
              onClick={closeMenu}
              className={`${styles.flagBtn} ${locale === 'en' ? styles.flagBtnActive : ''}`}
              aria-label="Switch to English"
              tabIndex={isOpen ? 0 : -1}
            >
              <UsFlag className={styles.flagIcon} />
            </Link>
            <Link
              href={pathname}
              locale="de"
              onClick={closeMenu}
              className={`${styles.flagBtn} ${locale === 'de' ? styles.flagBtnActive : ''}`}
              aria-label="Switch to German"
              tabIndex={isOpen ? 0 : -1}
            >
              <GermanFlag className={styles.flagIcon} />
            </Link>
          </div>
        </div>

        {/* Interactive Sticky Menu Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-controls="navigation-menu-panel"
          aria-label={isOpen ? t('closeMenu') : t('openMenu')}
          className={`${styles.menuButton} ${isOpen ? styles.menuButtonOpen : ''}`}
        >
          <span className={styles.iconCircle} aria-hidden="true">
            <span className={styles.burgerIcon}>
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
            </span>
            <svg
              className={styles.closeIcon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
            </svg>
          </span>
          <span className={styles.menuLabel}>{t('menu')}</span>
        </button>
      </div>
    </>
  );
}
