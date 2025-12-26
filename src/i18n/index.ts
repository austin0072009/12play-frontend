import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zh from './locales/zh.json';
import my from './locales/my.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'my', // Myanmar as default
    lng: 'my', // Set Myanmar as initial language
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      my: { translation: my },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

