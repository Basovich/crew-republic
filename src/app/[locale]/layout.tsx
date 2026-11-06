import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { drukHeavy, drukTextHeavy } from "@/fonts/fonts";
import { Footer } from "@/components/Footer/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { PasswordGate } from "@/components/PasswordGate";
import { AgeGate } from "@/components/AgeGate";
import { DrunkenSailorPreloader } from "@/components/DrunkenSailor/DrunkenSailorPreloader";
import { JackpotPreloader } from "@/components/Jackpot/JackpotPreloader";
import { FiresidePreloader } from "@/components/Fireside/FiresidePreloader";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "CREW Republic",
  description: "Craft Beer Revolution",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    title: "Crew Republic",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${drukHeavy.variable} ${drukTextHeavy.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <PasswordGate>
            <SmoothScrollProvider>
              <AgeGate />
              <DrunkenSailorPreloader />
              <JackpotPreloader />
              <FiresidePreloader />
              {children}
              <Footer />
            </SmoothScrollProvider>
          </PasswordGate>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
