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
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
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
    { href: '/trooper', label: t('trooper') },
    { href: '/contact', label: t('contact') },
  ];

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
        <nav className={styles.linksList} aria-label="Main Navigation">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
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
            <UsFlag size={36} />
          </Link>
          <Link
            href={pathname}
            locale="de"
            onClick={closeMenu}
            className={`${styles.flagBtn} ${locale === 'de' ? styles.flagBtnActive : ''}`}
            aria-label="Switch to German"
            tabIndex={isOpen ? 0 : -1}
          >
            <GermanFlag size={36} />
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
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </span>
        <span className={styles.menuLabel}>{t('menu')}</span>
      </button>
      </div>
    </>
  );
}
