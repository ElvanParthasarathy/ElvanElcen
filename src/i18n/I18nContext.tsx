import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from './en';
import { ta } from './ta';
import { ml } from './ml';

const dictionaries: Record<string, Record<string, string>> = {
  en
};

interface I18nContextProps {
  lang: string;
  actualLang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextProps>({
  lang: 'en',
  actualLang: 'en',
  setLang: () => {},
  t: (key: string) => key
});

export const useI18n = () => useContext(I18nContext);

export const I18nProvider = ({ children, initialLang = 'system' }: { children: ReactNode, initialLang?: string }) => {
  const [userLang, setUserLang] = useState(initialLang);
  const [actualLang, setActualLang] = useState('en');

  useEffect(() => {
    let resolved = userLang;
    if (userLang === 'system') {
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith('ta')) {
        resolved = 'ta';
      } else {
        resolved = 'en'; // Default fallback
      }
    }
    setActualLang(resolved);
  }, [userLang]);

  const t = (key: string) => {
    if (actualLang === 'en') return (en as any)[key] || key;
    
    if (actualLang.startsWith('ta')) {
      const obj = (ta as any)[key];
      if (!obj) return (en as any)[key] || key;
      if (actualLang === 'ta_latn') return obj.latn;
      if (actualLang === 'ta_ml') return obj.ml;
      return obj.ta;
    }
    
    if (actualLang.startsWith('ml')) {
      const obj = (ml as any)[key];
      if (!obj) return (en as any)[key] || key;
      if (actualLang === 'ml_latn') return obj.latn;
      if (actualLang === 'ml_tam') return obj.ta;
      return obj.ml;
    }

    return (en as any)[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang: userLang, actualLang, setLang: setUserLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};
