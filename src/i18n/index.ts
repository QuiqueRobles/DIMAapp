import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import es from './es.json';
import it from './it.json';
import de from './de.json';
import fr from './fr.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      it: { translation: it },
      de: { translation: de },
      fr: { translation: fr },
    },
    lng: 'en', // idioma por defecto
    fallbackLng: 'en', // idioma de respaldo
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;