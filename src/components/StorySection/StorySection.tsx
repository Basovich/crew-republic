import React from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/Button/Button';
import styles from './StorySection.module.scss';

export async function StorySection() {
  const t = await getTranslations('StorySection');

  return (
    <section className={styles.section} aria-labelledby="story-section-heading">
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 id="story-section-heading" className={styles.heading}>
            {t('heading')}
          </h2>

          <div className={styles.textBlock}>
            <p className={styles.description}>
              {t('description')}
            </p>

            <div className={styles.action}>
              <Button
                variant="secondary"
                size="lg"
                href="/brand-story"
                className={styles.button}
              >
                {t('buttonText')}
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src="/images/story/story-image.webp"
            alt={t('imageAlt')}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 568px"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
