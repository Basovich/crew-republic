import React from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/Button/Button';
import { Heading } from '@/components/Heading';
import styles from './StorySection.module.scss';

export interface ActionButton {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'giant';
  target?: string;
  rel?: string;
}

export interface StorySectionProps {
  id?: string;
  heading?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  buttons?: ActionButton[];
  imagePosition?: 'left' | 'right';
  headingClassName?: string;
}

export async function StorySection({
  id = 'story',
  heading,
  description,
  imageSrc = '/images/story/story-image.webp',
  imageAlt,
  buttons,
  imagePosition = 'right',
  headingClassName,
}: StorySectionProps = {}) {
  const t = await getTranslations('StorySection');

  const resolvedHeading = heading ?? t('heading');
  const resolvedDescription = description ?? t('description');
  const resolvedImageAlt = imageAlt ?? t('imageAlt');
  const headingId = `${id}-section-heading`;

  const resolvedButtons: ActionButton[] = buttons ?? [
    {
      label: t('buttonText'),
      href: '/brand-story',
      variant: 'secondary',
      size: 'lg',
    },
  ];

  const containerClasses = [
    styles.container,
    imagePosition === 'left' ? styles.imageLeft : '',
  ]
    .filter(Boolean)
    .join(' ');

  const resolvedHeadingClass = headingClassName
    ? (styles[headingClassName] ?? headingClassName)
    : '';

  const headingClasses = [styles.heading, resolvedHeadingClass]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={id} className={styles.section} aria-labelledby={headingId}>
      <div className={containerClasses}>
        <div className={styles.content}>
          <Heading id={headingId} level="h2" as="h2" className={headingClasses}>
            {resolvedHeading}
          </Heading>

          <div className={styles.textBlock}>
            <p className={styles.description}>
              {resolvedDescription}
            </p>

            <div className={styles.action}>
              <div className={styles.buttonGroup}>
                {resolvedButtons.map((btn, index) => (
                  <Button
                    key={`${btn.label}-${index}`}
                    variant={btn.variant ?? 'secondary'}
                    size={btn.size ?? 'lg'}
                    href={btn.href}
                    target={btn.target}
                    rel={btn.rel}
                    className={styles.button}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={imageSrc}
            alt={resolvedImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 568px"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
