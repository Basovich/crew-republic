'use client';

import React from 'react';
import styles from './FloatingActions.module.scss';

interface FloatingActionsProps {
  menuLabel?: string;
  onMenuClick?: () => void;
  onShopClick?: () => void;
}

export function FloatingActions({
  menuLabel = 'MENU',
  onMenuClick,
  onShopClick,
}: FloatingActionsProps) {
  return (
    <>
      {/* Centered Sticky Menu Button */}
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Open Navigation Menu"
      >
        <span className={styles.hamburgerIcon} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>{menuLabel}</span>
      </button>

      {/* Bottom Right Sticky Shop Button */}
      <button
        type="button"
        className={styles.shopButton}
        onClick={onShopClick}
        aria-label="Open Shop"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Price Tag with SHOP text */}
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      </button>
    </>
  );
}
