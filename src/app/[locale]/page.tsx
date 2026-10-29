import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import styles from "./page.module.scss";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("HomePage");
  const targetLocale = locale === "en" ? "de" : "en";

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("description")}</p>
        <p className={styles.welcome}>{t("welcome")}</p>
        <div className={styles.localeInfo}>{t("currentLanguage")}</div>
        <div>
          <Link
            href="/"
            locale={targetLocale}
            className={styles.languageSwitch}
          >
            {t("switchLanguage")}
          </Link>
        </div>
      </div>
    </main>
  );
}
