import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero/PageHero';
import { StorySection } from '@/components/StorySection/StorySection';
import { RepresentSection } from '@/components/RepresentSection/RepresentSection';
import { BeersSection } from '@/components/BeersSection/BeersSection';
import { FloatingActions } from '@/components/FloatingActions/FloatingActions';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crewrepublic.de';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages.brandStory' });

  const path = '/brand-story';
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
          url: `${BASE_URL}/images/brand-story/brand-story-hero.webp`,
          width: 1200,
          height: 600,
          alt: 'CREW Republic Brand Story',
        },
      ],
    },
  };
}

export default async function BrandStoryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'BrandStoryPage' });
  const tCommon = await getTranslations('Common');
  const tRepresent = await getTranslations('RepresentSection');

  return (
    <main>
      {/* 1. Page Hero: Large Image Banner with Header and Headline H1 */}
      <PageHero
        currentLocale={locale}
        currentPath="/brand-story"
        line1={t('hero.line1')}
        line2={t('hero.line2')}
        imageSrc="/images/brand-story/brand-story-hero.webp"
        imageAlt={t('hero.imageAlt')}
      />

      {/* 2. Block 1: Everyone needs a CREW */}
      <StorySection
        id="everyone-needs-crew"
        heading={t('block1.heading')}
        description={t('block1.description')}
        imageSrc="/images/brand-story/brand-story-1.webp"
        imageAlt={t('block1.imageAlt')}
        buttons={[
          {
            label: t('block1.buttonText'),
            href: 'https://www.crew-republic-shop.de/',
            variant: 'secondary',
            size: 'lg',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        ]}
      />

      {/* 3. Block 2: Community turns life into an experience */}
      <StorySection
        id="community-turns-life"
        heading={t('block2.heading')}
        description={t('block2.description')}
        imageSrc="/images/brand-story/brand-story-2.webp"
        imageAlt={t('block2.imageAlt')}
        headingClassName="narrowHeading"
        buttons={[
          {
            label: t('block2.buttonText'),
            href: '/contact',
            variant: 'secondary',
            size: 'lg',
          },
        ]}
      />

      {/* 4. Block 3: CREW Republic is the beer for moments that matter */}
      <StorySection
        id="moments-that-matter"
        heading={t('block3.heading')}
        description={t('block3.description')}
        imageSrc="/images/brand-story/brand-story-3.webp"
        imageAlt={t('block3.imageAlt')}
        headingClassName="heading800"
        buttons={[
          {
            label: t('block3.buttonText'),
            href: 'https://www.crew-republic-shop.de/',
            variant: 'secondary',
            size: 'lg',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        ]}
      />

      {/* 5. Represent the CREW: Interactive fast slideshow with merchandise button */}
      <RepresentSection
        heading={tRepresent('heading')}
        buttonText={tRepresent('buttonText')}
        imageAlt={tRepresent('imageAlt')}
        shopUrl="https://www.crew-republic-shop.de/"
      />

      {/* 6. Cheers for our Beers: Craft beers showcase */}
      <BeersSection />

      {/* Floating Menu & Shop Buttons */}
      <FloatingActions menuLabel={tCommon('menu')} />
    </main>
  );
}
