import type { Locale } from "./config";

export type Messages<T> = Record<Locale, T>;

/** 한국어를 기준으로 쓰고 나머지 언어는 같은 모양의 번역을 받는다 (웹과 같은 방식). */
export function defineMessages<T>(
  ko: T,
  translations: Record<Exclude<Locale, "ko">, T>,
): Messages<T> {
  return { ko, ...translations };
}
