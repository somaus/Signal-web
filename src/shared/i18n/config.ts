export const locales = ["ko", "en", "ja", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeNames: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "简体中文",
};

export const htmlLang: Record<Locale, string> = {
  ko: "ko",
  en: "en",
  ja: "ja",
  zh: "zh-CN",
};

export const intlLocale: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
};

export const openGraphLocale: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return locales.some((locale) => locale === value);
}

const TRADITIONAL_CHINESE = /^zh-(hant|tw|hk|mo)\b/;

export function matchAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const quality = params.find((param) => param.trim().startsWith("q="));
      return { tag, q: quality ? Number(quality.trim().slice(2)) : 1 };
    })
    .filter(({ tag, q }) => tag && !Number.isNaN(q) && q > 0)
    .sort((a, b) => b.q - a.q);

  let prefersTraditionalChinese = false;
  for (const { tag } of ranked) {
    if (TRADITIONAL_CHINESE.test(tag)) {
      prefersTraditionalChinese = true;
      continue;
    }
    if (tag === "zh" && prefersTraditionalChinese) continue;
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}
