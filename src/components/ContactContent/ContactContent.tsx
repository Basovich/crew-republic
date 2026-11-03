import React from 'react';
import { Heading } from '@/components/Heading';
import { Button } from '@/components/Button/Button';
import styles from './ContactContent.module.scss';

export interface ContactContentProps {
  heading: string;
  description1: string;
  description2: string;
  description3: string;
  email: string;
}

export function ContactContent({
  heading,
  description1,
  description2,
  description3,
  email,
}: ContactContentProps) {
  return (
    <section className={styles.section} aria-labelledby="contact-heading">
      <div className={styles.container}>
        <Heading id="contact-heading" level="h2" as="h2">
          {heading}
        </Heading>

        <div className={styles.textBlock}>
          <p className={styles.paragraph}>{description1}</p>
          <p className={styles.paragraph}>{description2}</p>
          <p className={styles.paragraph}>{description3}</p>
        </div>

        <div className={styles.action}>
          <Button
            variant="primary"
            size="lg"
            href={`mailto:${email}`}
            className={styles.emailButton}
          >
            {email.toUpperCase()}
          </Button>
        </div>
      </div>
    </section>
  );
}

