import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

/** DEFINED TRANSLATIONS */
import en from "./src/locales/en";
import fr from "./src/locales/fr";

i18n.translations = {
  en,
  fr,
};

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export default i18n;