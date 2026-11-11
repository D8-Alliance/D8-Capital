import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocaleCode } from '../types';
import { TranslationKey } from './types';
import { en } from './en';
import { ms } from './ms';
import { tr } from './tr';
import { az } from './az';

const DICTIONARIES: Record<LocaleCode, Record<TranslationKey, string>> = {
  en,
  ms,
  tr,
  az,
};

interface I18nContextType {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{
  children: React.ReactNode;
  initialLocale?: LocaleCode;
}> = ({ children, initialLocale = 'en' }) => {
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    const saved = localStorage.getItem('d8_locale') as LocaleCode;
    return saved && ['en', 'ms', 'tr', 'az'].includes(saved) ? saved : initialLocale;
  });

  const setLocale = (newLocale: LocaleCode) => {
    setLocaleState(newLocale);
    localStorage.setItem('d8_locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = DICTIONARIES[locale] || DICTIONARIES.en;
    let text = dict[key] || DICTIONARIES.en[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      });
    }

    return text;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
