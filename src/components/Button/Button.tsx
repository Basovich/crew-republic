'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import styles from './Button.module.scss';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: 'primary' | 'secondary';
  alternate?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'giant';
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export function Button({
  variant = 'primary',
  alternate = false,
  size = 'md',
  href,
  target,
  rel,
  type = 'button',
  disabled,
  children,
  className = '',
  onClick,
  ...restProps
}: ButtonProps) {
  const sizeClass = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
    giant: styles.sizeGiant,
  }[size];

  const variantClass = variant === 'secondary' ? styles.secondary : styles.primary;
  const alternateClass = alternate ? styles.alternate : '';

  const combinedClassName = [
    styles.button,
    variantClass,
    sizeClass,
    alternateClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // External link
  if (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:'))) {
    const safeRel = target === '_blank' ? (rel || 'noopener noreferrer') : rel;
    return (
      <a
        href={href}
        target={target}
        rel={safeRel}
        className={combinedClassName}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </a>
    );
  }

  // Internal next-intl localized link
  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={combinedClassName}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </Link>
    );
  }

  // Default button element
  return (
    <button
      type={type}
      disabled={disabled}
      className={combinedClassName}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  );
}
