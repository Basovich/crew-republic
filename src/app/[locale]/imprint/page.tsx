import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero/PageHero';
import { ImprintContent, type ImprintContentData } from '@/components/ImprintContent';
import { FloatingActions } from '@/components/FloatingActions/FloatingActions';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crewrepublic.de';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages.imprint' });

  const path = '/imprint';
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
          alt: 'CREW Republic Imprint',
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

export default async function ImprintPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'ImprintPage' });
  const tCommon = await getTranslations('Common');

  const imprintData: ImprintContentData = {
    heading: t('content.heading'),
    companyName: t('content.companyName'),
    street: t('content.street'),
    city: t('content.city'),
    country: t('content.country'),
    phoneLabel: t('content.phoneLabel'),
    phoneValue: t('content.phoneValue'),
    phoneHref: t('content.phoneHref'),
    mailLabel: t('content.mailLabel'),
    mailValue: t('content.mailValue'),
    mailHref: t('content.mailHref'),
    managingDirectorsTitle: t('content.managingDirectorsTitle'),
    managingDirectors: t.raw('content.managingDirectors') as string[],
    vat: t('content.vat'),
    court: t('content.court'),
  };

  return (
    <main>
      {/* 1. Page Hero: Universal Banner with Header and Headline H1 */}
      <PageHero
        currentLocale={locale}
        currentPath="/imprint"
        line1={t('hero.line1')}
        line2={t('hero.line2')}
        imageSrc="/images/privacy-policy/privacy-policy-hero.webp"
        imageAlt={t('hero.imageAlt')}
      />

      {/* 2. Structured Imprint / Legal Content Block */}
      <ImprintContent data={imprintData} />

      {/* Floating Menu & Shop Buttons */}
      <FloatingActions menuLabel={tCommon('menu')} />
    </main>
  );
}

