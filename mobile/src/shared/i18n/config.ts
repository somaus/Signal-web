export const locales = ["ko", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

export const localeNames: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
};

/** 서버에 보내는 Accept-Language 값. */
export const htmlLang: Record<Locale, string> = {
  ko: "ko",
  en: "en",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return locales.some((locale) => locale === value);
}
