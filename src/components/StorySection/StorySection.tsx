import React from 'react';
import { getTranslations } from 'next-intl/server';
import { StorySectionClient, type ActionButton } from './StorySectionClient';

export type { ActionButton };

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

  return (
    <StorySectionClient
      id={id}
      headingId={headingId}
      heading={resolvedHeading}
      description={resolvedDescription}
      imageSrc={imageSrc}
      imageAlt={resolvedImageAlt}
      buttons={resolvedButtons}
      imagePosition={imagePosition}
      headingClassName={headingClassName}
    />
  );
}
