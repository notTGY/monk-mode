// https://github.com/i18next/react-i18next/blob/master/example/react/src/i18n.js
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const debug = import.meta.env.DEV

const options = {loadPath: '/dist/locales/{{lng}}/{{ns}}.json',}

i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    load: 'languageOnly',
    cleanCode: true,
    nonExplicitSupportedLngs: true,
    fallbackLng: 'en',
    debug,
    backend: options,
  });

export default i18n;
