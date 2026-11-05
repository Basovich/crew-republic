import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero/PageHero';
import { GtcContent, type GtcContentData } from '@/components/GtcContent';
import { FloatingActions } from '@/components/FloatingActions/FloatingActions';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crewrepublic.de';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages.gtc' });

  const path = '/gtc';
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
          url: `${BASE_URL}/images/privacy-policy/privacy-policy-hero.webp`,
          width: 1200,
          height: 600,
          alt: 'CREW Republic General Terms and Conditions',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | CREW Republic`,
      description: t('description'),
      images: [`${BASE_URL}/images/privacy-policy/privacy-policy-hero.webp`],
    },
  };
}

export default async function GtcPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'GtcPage' });
  const tCommon = await getTranslations('Common');

  const gtcData = t.raw('content') as GtcContentData;

  return (
    <main>
      {/* 1. Page Hero: Universal Banner with Header and Headline H1 */}
      <PageHero
        currentLocale={locale}
        currentPath="/gtc"
        line1={t('hero.line1')}
        line2={t('hero.line2')}
        imageSrc="/images/privacy-policy/privacy-policy-hero.webp"
        imageAlt={t('hero.imageAlt')}
      />

      {/* 2. Structured GTC / AGB Content with Interactive Table of Contents */}
      <GtcContent data={gtcData} />

      {/* Floating Menu & Shop Buttons */}
      <FloatingActions menuLabel={tCommon('menu')} />
    </main>
  );
}
