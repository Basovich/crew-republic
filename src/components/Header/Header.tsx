import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { UsFlag, GermanFlag } from './FlagIcons';
import styles from './Header.module.scss';

interface HeaderProps {
  currentLocale: string;
  currentPath?: string;
}

export function Header({ currentLocale, currentPath = '/' }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink} aria-label="CREW Republic Home">
        <Image
          src="/images/Logo-Header.svg"
          alt="CREW Republic"
          width={157}
          height={146}
          priority
          className={styles.logoImage}
        />
      </Link>

      <nav className={styles.langSwitch} aria-label="Language selection">
        <Link
          href={currentPath}
          locale="en"
          className={`${styles.flagBtn} ${currentLocale === 'en' ? styles.active : ''}`}
          aria-label="Switch to English"
        >
          <UsFlag size={22} />
        </Link>
        <Link
          href={currentPath}
          locale="de"
          className={`${styles.flagBtn} ${currentLocale === 'de' ? styles.active : ''}`}
          aria-label="Switch to German"
        >
          <GermanFlag size={22} />
        </Link>
      </nav>
    </header>
  );
}
