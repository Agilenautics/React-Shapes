import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


// Function to dynamically import locales
function importLocales() {
  const locales = ['en', 'fr', 'ar']; // Add more locales as needed
  return locales.reduce((acc, locale) => {
    acc[locale] = { translation: require(`../../public/locales/${locale}/default.json`) };
    return acc;
  }, {});
}

// Language resources (translations)
const resources = importLocales();

try {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      fallbackLng: 'en',
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      },
      interpolation: {
        escapeValue: false,
      },
    });
} catch (error) {
  console.error('Error initializing i18n:', error);
}

export default i18n;
