import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import { defaultLocale, isLocale, type Locale } from "./config";
import { setCurrentLocale } from "./currentLocale";
import type { Messages } from "./defineMessages";

const LOCALE_KEY = "locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function deviceLocale(): Locale {
  const code = getLocales()[0]?.languageCode;
  return isLocale(code) ? code : defaultLocale;
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const initial = deviceLocale();
    setCurrentLocale(initial);
    return initial;
  });

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(LOCALE_KEY)
      .then((saved) => {
        if (active && isLocale(saved)) {
          setCurrentLocale(saved);
          setLocaleState(saved);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setCurrentLocale(next);
    setLocaleState(next);
    AsyncStorage.setItem(LOCALE_KEY, next).catch(() => undefined);
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18nContext(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("I18nProvider 안에서만 사용할 수 있습니다.");
  return value;
}

export function useLocale() {
  return useI18nContext();
}

/** 메시지 묶음에서 현재 언어의 문구를 꺼낸다. 언어가 바뀌면 다시 렌더링된다. */
export function useMessages<T>(messages: Messages<T>): T {
  return messages[useI18nContext().locale];
}
