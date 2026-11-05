import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero/PageHero';
import {
  PrivacyContent,
  type PrivacyContentData,
} from '@/components/PrivacyContent';
import { FloatingActions } from '@/components/FloatingActions/FloatingActions';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crewrepublic.de';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages.privacyPolicy' });

  const path = '/privacy-policy';
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
          alt: 'CREW Republic Privacy Policy',
        },
      ],
    },
  };
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'PrivacyPolicyPage' });
  const tCommon = await getTranslations('Common');

  const privacyData = t.raw('content') as PrivacyContentData;

  return (
    <main>
      {/* 1. Page Hero: Universal Banner with Header and Headline H1 */}
      <PageHero
        currentLocale={locale}
        currentPath="/privacy-policy"
        line1={t('hero.line1')}
        line2={t('hero.line2')}
        imageSrc="/images/privacy-policy/privacy-policy-hero.webp"
        imageAlt={t('hero.imageAlt')}
      />

      {/* 2. Structured Legal Content Block */}
      <PrivacyContent data={privacyData} />

      {/* Floating Menu & Shop Buttons */}
      <FloatingActions menuLabel={tCommon('menu')} />
    </main>
  );
}
