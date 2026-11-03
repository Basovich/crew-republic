import React from 'react';
import { Heading } from '@/components/Heading';
import styles from './ImprintContent.module.scss';

export interface ImprintContentData {
  heading: string;
  companyName: string;
  street: string;
  city: string;
  country: string;
  phoneLabel: string;
  phoneValue: string;
  phoneHref: string;
  mailLabel: string;
  mailValue: string;
  mailHref: string;
  managingDirectorsTitle: string;
  managingDirectors: string[];
  vat: string;
  court: string;
}

interface ImprintContentProps {
  data: ImprintContentData;
}

export function ImprintContent({ data }: ImprintContentProps) {
  // Construct a safe, localized Google Maps query URL
  const encodedAddress = encodeURIComponent(
    `${data.street}, ${data.city}, ${data.country}`
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <section className={styles.section} aria-labelledby="imprint-heading">
      <div className={styles.container}>
        <Heading id="imprint-heading" level="h2" as="h2">
          {data.heading}
        </Heading>

        <div className={styles.contentBlock}>
          {/* Company Name & Physical Address */}
          <address className={styles.group}>
            <span className={styles.companyName}>{data.companyName}</span>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.addressLink}
              title={`${data.street}, ${data.city}, ${data.country} on Google Maps`}
              aria-label={`${data.street}, ${data.city}, ${data.country} on Google Maps`}
            >
              <span className={styles.line}>{data.street}</span>
              <span className={styles.line}>{data.city}</span>
              <span className={styles.line}>{data.country}</span>
            </a>
          </address>

          {/* Contact (Phone & Email) */}
          <div className={styles.group}>
            <p className={styles.line}>
              {data.phoneLabel}{' '}
              <a href={data.phoneHref} className={styles.link}>
                {data.phoneValue}
              </a>
            </p>
            <p className={styles.line}>
              {data.mailLabel}{' '}
              <a href={data.mailHref} className={styles.link}>
                {data.mailValue}
              </a>
            </p>
          </div>

          {/* Managing Directors */}
          <div className={styles.group}>
            <p className={styles.groupTitle}>{data.managingDirectorsTitle}</p>
            <div className={styles.directorsList}>
              {data.managingDirectors.map((director, index) => (
                <span key={`director-${index}`} className={styles.line}>
                  {director}
                </span>
              ))}
            </div>
          </div>

          {/* Legal / VAT & Registry Details */}
          <div className={styles.group}>
            <p className={styles.line}>{data.vat}</p>
            <p className={styles.line}>{data.court}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

