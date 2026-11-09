import { defaultLocale, type Locale } from "./config";
import type { Messages } from "./defineMessages";

let current: Locale = defaultLocale;

/** 컴포넌트 밖(API 클라이언트 등)에서 현재 언어를 읽을 때 쓴다. I18nProvider가 값을 맞춰 둔다. */
export function currentLocale(): Locale {
  return current;
}

export function setCurrentLocale(locale: Locale) {
  current = locale;
}

export function translate<T>(messages: Messages<T>): T {
  return messages[current];
}
