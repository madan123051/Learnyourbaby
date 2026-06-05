import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lang, UI } from '../i18n';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof UI['en'];
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: UI.en,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('sumiLang');
      if (saved === 'en' || saved === 'ja' || saved === 'ne') return saved;
    } catch {}
    return 'en';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('sumiLang', l); } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: UI[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
