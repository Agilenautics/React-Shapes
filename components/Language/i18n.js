import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { remoteConfig, fetchAndActivate, getValue } from "../../auth";

// Function to dynamically import locales
async function importLocales() {
  let parsedRemoteStrings;

  // Example usage with remoteConfig (remember to handle the case where remoteConfig is undefined)
  if (remoteConfig) {
    try {
      remoteConfig.settings = {
        minimumFetchIntervalMillis: 1000, // 1 sec
      };

      // Fetch the remote configuration and activate it
      await fetchAndActivate(remoteConfig);

      console.log("Remote config activated!");
      const greeting = getValue(remoteConfig, "flow_chart_language");
      parsedRemoteStrings = JSON.parse(greeting._value);
      console.log(parsedRemoteStrings);
    } catch (error) {
      console.error("Error fetching and activating remote config:", error);
    }
  } else {
    console.warn("Remote config is not available in this environment.");
  }

  const locales = Object.keys(parsedRemoteStrings || {}); // Get locales dynamically
  return locales.reduce((acc, locale) => {
    acc[locale] = {
      translation: parsedRemoteStrings[locale] || {}, // Use remote config value or empty object
    };
    return acc;
  }, {});
}

// Language resources (translations)
const resources = await importLocales();

try {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      fallbackLng: "en",
      detection: {
        order: [
          "querystring",
          "cookie",
          "localStorage",
          "navigator",
          "htmlTag",
          "path",
          "subdomain",
        ],
      },
      interpolation: {
        escapeValue: false,
      },
    });
} catch (error) {
  console.error("Error initializing i18n:", error);
}

export default i18n;
