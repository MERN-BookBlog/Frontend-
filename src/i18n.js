// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      trendingBooks: "Trending Books",
      readLater: "Save to Read Later",
      quickRead: "Quick Read",
      notes: "Notes",
    }
  },
  hi: {
    translation: {
      welcome: "स्वागत है",
      trendingBooks: "ट्रेंडिंग किताबें",
      readLater: "बाद में पढ़ें",
      quickRead: "त्वरित पढ़ें",
      notes: "टिप्पणियाँ",
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
