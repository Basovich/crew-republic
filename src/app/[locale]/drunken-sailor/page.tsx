import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/Header/Header';
import { FloatingActions } from '@/components/FloatingActions/FloatingActions';
import styles from '@/styles/pageContainer.module.scss';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crewrepublic.de';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages.drunkenSailor' });

  const path = '/drunken-sailor';
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
    },
  };
}

export default async function DrunkenSailorPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Pages.drunkenSailor' });
  const tCommon = await getTranslations('Common');

  return (
    <main className={styles.pageMain}>
      <Header currentLocale={locale} currentPath="/drunken-sailor" />

      <section className={styles.heroContent}>
        <h1 className={styles.title}>{t('heading')}</h1>
        <p className={styles.subtitle}>{t('description')}</p>
      </section>

      <FloatingActions menuLabel={tCommon('menu')} />
    </main>
  );
}
