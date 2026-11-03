import React from 'react';
import styles from './Heading.module.scss';

export type HeadingLevel =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'tagline'
  | 'highlight';

export type HeadingTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div';

export interface HeadingProps extends React.HTMLAttributes<HTMLElement> {
  level?: HeadingLevel;
  as?: HeadingTag;
  children: React.ReactNode;
  className?: string;
}

const DEFAULT_TAG_MAP: Record<HeadingLevel, HeadingTag> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  tagline: 'p',
  highlight: 'span',
};

export const Heading = React.forwardRef<HTMLElement, HeadingProps>(
  ({ level = 'h2', as, className, children, ...rest }, ref) => {
    const Tag = (as || DEFAULT_TAG_MAP[level] || 'h2') as React.ElementType;
    const levelClass = styles[level] || styles.h2;

    return (
      <Tag
        ref={ref}
        className={`${styles.heading} ${levelClass}${className ? ` ${className}` : ''}`}
        {...rest}
      >
        {children}
      </Tag>
    );
  }
);

Heading.displayName = 'Heading';

