import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/Header/Header';
import { FloatingActions } from '@/components/FloatingActions/FloatingActions';
import { FiresideExperience } from '@/components/Fireside/FiresideExperience';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crewrepublic.de';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages.fireside' });

  const path = '/fireside';
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
          url: '/images/beers/fireside.webp',
          width: 800,
          height: 800,
          alt: 'Fireside Red Ale',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | CREW Republic`,
      description: t('description'),
      images: ['/images/beers/fireside.webp'],
    },
  };
}

export default async function FiresidePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Pages.fireside' });
  const tCommon = await getTranslations('Common');

  const content = {
    heading: t('heading'),
    subtitle: t('subtitle'),
    intro: {
      title: t('intro.title'),
      p1: t('intro.p1'),
      p2: t('intro.p2'),
    },
    stats: {
      ariaLabel: t('stats.ariaLabel'),
    },
    tastometer: {
      hopsTitle: t('tastometer.hopsTitle'),
      hopsValue: t('tastometer.hopsValue'),
      maltTitle: t('tastometer.maltTitle'),
      maltValue: t('tastometer.maltValue'),
      colorTitle: t('tastometer.colorTitle'),
      colorValue: t('tastometer.colorValue'),
      tempTitle: t('tastometer.tempTitle'),
      tempValue: t('tastometer.tempValue'),
    },
    match: {
      tasteTitle: t('match.tasteTitle'),
      tasteText: t('match.tasteText'),
      drinkWithTitle: t('match.drinkWithTitle'),
      drinkWithText: t('match.drinkWithText'),
    },
    awards: {
      title: t('awards.title'),
      ariaLabel: t('awards.ariaLabel'),
    },
    shop: {
      heading: t('shop.heading'),
      button: t('shop.button'),
      url: t('shop.url'),
    },
  };

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Fireside Red Ale',
    image: `${BASE_URL}/images/beers/fireside.webp`,
    description: t('description'),
    brand: {
      '@type': 'Brand',
      name: 'CREW Republic',
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}${locale === 'en' ? '/contact' : '/de/contact'}`,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/images/fireside/animations/images/image_99.webp"
        type="image/webp"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Header currentLocale={locale} currentPath="/fireside" />
      <FiresideExperience t={content} />
      <FloatingActions menuLabel={tCommon('menu')} />
    </>
  );
}
