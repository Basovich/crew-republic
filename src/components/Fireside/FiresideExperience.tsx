'use client';

import React from 'react';
import { BeerExperience } from '@/components/BeerExperience/BeerExperience';
import type { BeerTranslations } from '@/components/BeerExperience/types';
import { firesideConfig } from './firesideConfig';

interface FiresideExperienceProps {
  t: BeerTranslations;
}

export function FiresideExperience({ t }: FiresideExperienceProps) {
  return (
    <BeerExperience
      config={firesideConfig}
      t={t}
      reverseFoodOnMobile={false}
    />
  );
}

