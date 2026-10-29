import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/Header/Header';
import { HeroSlider } from '@/components/HeroSlider/HeroSlider';
import { FloatingActions } from '@/components/FloatingActions/FloatingActions';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHero = await getTranslations('Hero');
  const tCommon = await getTranslations('Common');

  return (
    <main>
      {/* Top Header with Logo & Language Switcher */}
      <Header currentLocale={locale} />

      {/* Hero Infinite Draggable Slider with Headline */}
      <HeroSlider
        line1={tHero('line1')}
        line2={tHero('line2')}
      />

      {/* Floating Menu & Shop Buttons Attached to Viewport */}
      <FloatingActions menuLabel={tCommon('menu')} />
    </main>
  );
}
