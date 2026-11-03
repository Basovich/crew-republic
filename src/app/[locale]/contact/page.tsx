import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero/PageHero';
import { ContactContent } from '@/components/ContactContent';
import { RepresentSection } from '@/components/RepresentSection/RepresentSection';
import { FloatingActions } from '@/components/FloatingActions/FloatingActions';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crewrepublic.de';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages.contact' });

  const path = '/contact';
  const localizedPath = locale === 'en' ? path : `/de${path}`;

  return {
    title: `${t('title')} | CREW Republic`,
    description: t('description'),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}${localizedPath}`,
      languages: {
        en: `${BASE_URL}${path}`,
        de: `${BASE_URL}/de${path}`,
        'x-default': `${BASE_URL}${path}`,
      },
    },
    openGraph: {
      title: `${t('title')} | CREW Republic`,
      description: t('description'),
      url: `${BASE_URL}${localizedPath}`,
      siteName: 'CREW Republic',
      locale: locale === 'en' ? 'en_US' : 'de_DE',
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/images/contact/contact-hero.webp`,
          width: 1200,
          height: 548,
          alt: 'CREW Republic Contact',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | CREW Republic`,
      description: t('description'),
      images: [`${BASE_URL}/images/contact/contact-hero.webp`],
    },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  const tCommon = await getTranslations('Common');

  return (
    <main>
      {/* 1. Universal Page Hero Banner */}
      <PageHero
        currentLocale={locale}
        currentPath="/contact"
        line1={t('hero.line1')}
        line2={t('hero.line2')}
        imageSrc="/images/contact/contact-hero.webp"
        imageAlt={t('hero.imageAlt')}
      />

      {/* 2. Contact Content Block */}
      <ContactContent
        heading={t('content.heading')}
        description1={t('content.description1')}
        description2={t('content.description2')}
        description3={t('content.description3')}
        email="crew@crewrepublic.de"
      />

      {/* 3. Untappd Banner (Universal RepresentSection) */}
      <RepresentSection
        id="untappd-banner-heading"
        heading={t('banner.heading')}
        imageSrc="/images/contact/untappd.webp"
        imageAlt={t('banner.imageAlt')}
        buttons={[
          {
            label: t('banner.btnShop'),
            href: 'https://www.crew-republic-shop.de/',
            variant: 'primary',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          {
            label: t('banner.btnUntappd'),
            href: 'https://untappd.com/brewery/25672',
            variant: 'secondary',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        ]}
        badgeIcon={
          <Image
            src="/images/contact/untappd-badge.webp"
            alt="Untappd"
            width={44}
            height={44}
            style={{ borderRadius: 8 }}
          />
        }
      />

      {/* 4. Floating Menu & Cart Actions */}
      <FloatingActions menuLabel={tCommon('menu')} />
    </main>
  );
}
