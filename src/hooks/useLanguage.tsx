
import { createContext, useContext, useEffect, useState } from 'react';
import {en} from '../i18n/en';
import {fr} from '../i18n/fr';
import {pt} from '../i18n/pt';

type Language = 'en' | 'fr' | 'pt';
type Translations = typeof en;

const translations = { en, fr, pt };

const LanguageContext = createContext<{
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
}>({
  language: 'en',
  t: en,
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    if (stored && ['en', 'fr', 'pt'].includes(stored)) {
      return stored as Language;
    }
    
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'fr', 'pt'].includes(browserLang)) {
      return browserLang as Language;
    }
    
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      t: translations[language],
      setLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
