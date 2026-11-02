import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/Header/Header';
import { HeroSlider } from '@/components/HeroSlider/HeroSlider';
import { StorySection } from '@/components/StorySection/StorySection';
import { BeersSection } from '@/components/BeersSection/BeersSection';
import { AwardsSection } from '@/components/AwardsSection/AwardsSection';
import { FloatingActions } from '@/components/FloatingActions/FloatingActions';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHero = await getTranslations('Hero');
  const tCommon = await getTranslations('Common');
  const tAwards = await getTranslations('AwardsSection');

  const awardTranslations: Record<string, string> = {
    award1: tAwards('awards.award1'),
    award2: tAwards('awards.award2'),
    award3: tAwards('awards.award3'),
    award4: tAwards('awards.award4'),
    award5: tAwards('awards.award5'),
    award6: tAwards('awards.award6'),
    award7: tAwards('awards.award7'),
  };

  return (
    <main>
      {/* Top Header with Logo & Language Switcher */}
      <Header currentLocale={locale} />

      {/* Hero Infinite Draggable Slider with Headline */}
      <HeroSlider
        line1={tHero('line1')}
        line2={tHero('line2')}
      />

      {/* Story Section: The Beer for the moments you share */}
      <StorySection />

      {/* Beers Section: Cheers for our Beers */}
      <BeersSection />

      {/* Awards Section: Your CREW deserves the best */}
      <AwardsSection
        heading={tAwards('heading')}
        ariaLabel={tAwards('ariaLabel')}
        awardTranslations={awardTranslations}
      />

      {/* Floating Menu & Shop Buttons Attached to Viewport */}
      <FloatingActions menuLabel={tCommon('menu')} />
    </main>
  );
}
