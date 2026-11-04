'use client';

import React from 'react';
import { BeerExperience } from '@/components/BeerExperience/BeerExperience';
import type { BeerTranslations } from '@/components/BeerExperience/types';
import { drunkenSailorConfig } from './drunkenSailorConfig';

interface DrunkenSailorExperienceProps {
  t: BeerTranslations;
}

export function DrunkenSailorExperience({ t }: DrunkenSailorExperienceProps) {
  return (
    <BeerExperience
      config={drunkenSailorConfig}
      t={t}
      reverseFoodOnMobile={false}
    />
  );
}
