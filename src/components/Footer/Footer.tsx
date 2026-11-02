'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { UsFlag, GermanFlag } from '@/components/Header/FlagIcons';
import { Button } from '@/components/Button/Button';
import styles from './Footer.module.scss';

export function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* Top Emblem */}
        <div className={styles.emblemWrapper}>
          <Image
            src="/images/footer-emblem.svg"
            alt={t('emblemAlt')}
            width={1200}
            height={240}
            className={styles.emblemDesktop}
            loading="lazy"
          />
          <Image
            src="/images/footer-emblem-mobile.svg"
            alt={t('emblemAlt')}
            width={358}
            height={220}
            className={styles.emblemMobile}
            loading="lazy"
          />
        </div>

        {/* Columns Section */}
        <div className={styles.columns}>
          {/* Column 1: WE ARE CREW */}
          <div className={`${styles.column} ${styles.colWeAreCrew}`}>
            <span className={styles.columnTagline}>{t('weAreCrew')}</span>
            <address className={styles.address}>
              <span>{t('companyName')}</span>
              <span>{t('street')}</span>
              <span>{t('city')}</span>
            </address>
            <div className={styles.actionWrapper}>
              <Link href="/contact" className={styles.drukLink}>
                {t('sendUsMessage')}
              </Link>
            </div>
          </div>

          {/* Column 2: OUR BEERS */}
          <div className={`${styles.column} ${styles.colOurBeers}`}>
            <span className={styles.columnTagline}>{t('ourBeers')}</span>
            <nav className={styles.linksNav} aria-label={t('ourBeers')}>
              <Link href="/brand-story" className={styles.drukLink}>
                {t('crewStory')}
              </Link>
              <Link href="/drunken-sailor" className={styles.drukLink}>
                {t('drunkenSailor')}
              </Link>
              <Link href="/jackpot" className={styles.drukLink}>
                {t('jackpot')}
              </Link>
              <a
                href="https://www.crew-republic-shop.de/Biere/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.drukLink}
              >
                {t('fireside')}
              </a>
            </nav>
          </div>

          {/* Column 3: OUR SERVICE FOR YOU */}
          <div className={`${styles.column} ${styles.colOurService}`}>
            <span className={styles.columnTagline}>{t('ourService')}</span>
            <nav className={styles.linksNav} aria-label={t('ourService')}>
              <a
                href="https://www.crew-republic-shop.de/Rechtliches/Datenschutz-Cookies/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.drukLink}
              >
                {t('privacyPolicy')}
              </a>
              <a
                href="https://www.crew-republic-shop.de/Infos-Hinweise/AGB/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.drukLink}
              >
                {t('gtc')}
              </a>
              <a
                href="https://www.crew-republic-shop.de/Rechtliches/Impressum/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.drukLink}
              >
                {t('imprint')}
              </a>
            </nav>

            {/* Embedded Language Switcher */}
            <div className={styles.langSwitch} role="group" aria-label={t('switchLanguage')}>
              <Link
                href={pathname}
                locale="en"
                className={`${styles.flagBtn} ${locale === 'en' ? styles.active : ''}`}
                aria-label="Switch to English"
              >
                <UsFlag className={styles.flagIcon} />
              </Link>
              <Link
                href={pathname}
                locale="de"
                className={`${styles.flagBtn} ${locale === 'de' ? styles.active : ''}`}
                aria-label="Switch to German"
              >
                <GermanFlag className={styles.flagIcon} />
              </Link>
            </div>
          </div>

          {/* Column 4: CREWMUNITY */}
          <div className={`${styles.column} ${styles.colCrewmunity}`}>
            <span className={styles.columnTagline}>{t('crewmunity')}</span>
            <div className={styles.linksNav}>
              <a
                href="https://www.instagram.com/crewrepublic/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.drukLink}
              >
                {t('instagram')}
              </a>
              <a
                href="https://www.facebook.com/CREWrepublic.de/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.drukLink}
              >
                {t('facebook')}
              </a>
              <a
                href="https://untappd.com/brewery/25672"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.drukLink}
              >
                {t('untappd')}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Giant Pill CTA Button */}
        <div className={styles.ctaWrapper}>
          <Button
            href="https://www.crew-republic-shop.de/"
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="giant"
          >
            {t('buyBetterBeer')}
          </Button>
        </div>
      </div>
    </footer>
  );
}
