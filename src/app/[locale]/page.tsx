import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/Header/Header';
import { HeroSlider } from '@/components/HeroSlider/HeroSlider';
import { StorySection } from '@/components/StorySection/StorySection';
import { BeersSection } from '@/components/BeersSection/BeersSection';
import { AwardsSection } from '@/components/AwardsSection/AwardsSection';
import { RepresentSection } from '@/components/RepresentSection/RepresentSection';
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
  const tCrewmunity = await getTranslations('CrewmunitySection');
  const tRepresent = await getTranslations('RepresentSection');
  const tTap = await getTranslations('TapSection');

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
      <StorySection id="story" />

      {/* Beers Section: Cheers for our Beers */}
      <BeersSection />

      {/* Awards Section: Your CREW deserves the best */}
      <AwardsSection
        heading={tAwards('heading')}
        ariaLabel={tAwards('ariaLabel')}
        awardTranslations={awardTranslations}
      />

      {/* Crewmunity Section: Join the CREWmunity */}
      <StorySection
        id="crewmunity"
        heading={tCrewmunity('heading')}
        description={tCrewmunity('description')}
        imageSrc="/images/crewmunity/crewmunity.webp"
        imageAlt={tCrewmunity('imageAlt')}
        buttons={[
          {
            label: tCrewmunity('instagram'),
            href: 'https://www.instagram.com/crewrepublicbrewery/',
            variant: 'primary',
            size: 'lg',
            target: '_blank',
          },
          {
            label: tCrewmunity('facebook'),
            href: 'https://www.facebook.com/crewrepublic',
            variant: 'secondary',
            size: 'lg',
            target: '_blank',
          },
        ]}
      />

      {/* Represent Section: Represent the CREW */}
      <RepresentSection
        heading={tRepresent('heading')}
        buttonText={tRepresent('buttonText')}
        imageAlt={tRepresent('imageAlt')}
        shopUrl="https://www.crew-republic-shop.de/Merch/"
      />

      {/* Tap Section: Tap into the CREW (Image first / left on desktop) */}
      <StorySection
        id="tap"
        imagePosition="left"
        heading={tTap('heading')}
        description={tTap('description')}
        imageSrc="/images/tap/tap-into-crew.webp"
        imageAlt={tTap('imageAlt')}
        buttons={[
          {
            label: tTap('buttonText'),
            href: '/contact',
            variant: 'secondary',
            size: 'lg',
          },
        ]}
      />

      {/* Floating Menu & Shop Buttons Attached to Viewport */}
      <FloatingActions menuLabel={tCommon('menu')} />
    </main>
  );
}
