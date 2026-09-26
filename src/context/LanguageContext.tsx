'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { IntlProvider } from 'next-intl';

// Load messages
import en from '../../messages/en.json';
import ar from '../../messages/ar.json';
import fr from '../../messages/fr.json';
import de from '../../messages/de.json';
import it from '../../messages/it.json';
import es from '../../messages/es.json';
import zh from '../../messages/zh.json';
import ru from '../../messages/ru.json';

const messagesMap: Record<string, any> = {
  en, ar, fr, de, it, es, zh, ru
};

type LanguageContextType = {
  locale: string;
  setLocale: (loc: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('egyptx-locale');
    if (saved && messagesMap[saved]) {
      setLocaleState(saved);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (messagesMap[browserLang]) {
        setLocaleState(browserLang);
      }
    }
    setMounted(true);
  }, []);

  const setLocale = (loc: string) => {
    setLocaleState(loc);
    localStorage.setItem('egyptx-locale', loc);
  };

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale, mounted]);

  // Simple nested key resolver for custom t()
  const t = (key: string): string => {
    const keys = key.split('.');
    let val = messagesMap[locale] || messagesMap['en'];
    for (const k of keys) {
      if (val[k] !== undefined) val = val[k];
      else return key; // fallback to key
    }
    return typeof val === 'string' ? val : key;
  };

  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      <IntlProvider locale={locale} messages={messagesMap[locale]}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};
