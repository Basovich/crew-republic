import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { drukHeavy, drukTextHeavy } from '@/fonts/fonts';
import { PasswordGate } from '@/components/PasswordGate';
import { AgeGate } from '@/components/AgeGate';
import { NotFoundView } from '@/components/NotFoundView';
import enMessages from '@/messages/en.json';
import deMessages from '@/messages/de.json';
import '@/styles/globals.scss';

async function resolveNotFoundLocale(): Promise<'en' | 'de'> {
  const reqHeaders = await headers();
  const intlLocale = reqHeaders.get('x-next-intl-locale');
  if (intlLocale === 'de') {
    return 'de';
  }
  return 'en';
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveNotFoundLocale();
  const dict = locale === 'de' ? deMessages : enMessages;

  return {
    title: dict.NotFoundPage.metaTitle,
    description: dict.NotFoundPage.metaDescription,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function GlobalNotFound() {
  const locale = await resolveNotFoundLocale();
  const messages = locale === 'de' ? deMessages : enMessages;

  return (
    <html
      lang={locale}
      className={`${drukHeavy.variable} ${drukTextHeavy.variable}`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <PasswordGate>
            <AgeGate />
            <NotFoundView />
          </PasswordGate>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
