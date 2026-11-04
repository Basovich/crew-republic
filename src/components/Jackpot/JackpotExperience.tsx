'use client';

import React from 'react';
import { BeerExperience } from '@/components/BeerExperience/BeerExperience';
import type { BeerTranslations } from '@/components/BeerExperience/types';
import { jackpotConfig } from './jackpotConfig';

interface JackpotExperienceProps {
  t: BeerTranslations;
}

export function JackpotExperience({ t }: JackpotExperienceProps) {
  return (
    <BeerExperience
      config={jackpotConfig}
      t={t}
      reverseFoodOnMobile={true}
    />
  );
}

