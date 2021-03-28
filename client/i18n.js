import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import localeDe from '../public/locales/de.json';
import localeEn from '../public/locales/en.json';
import localeEs from '../public/locales/es.json';
import localeFr from '../public/locales/fr.json';
import localeIt from '../public/locales/it.json';
import localeKo from '../public/locales/ko.json';
import localePt from '../public/locales/pt.json';
import localePl from '../public/locales/pl.json';
import localeTh from '../public/locales/th.json';
import localeZhHans from '../public/locales/zhhans.json';
import localeZhHant from '../public/locales/zhhant.json';

const resources = {
    de: {
        translation: localeDe
    },
    en: {
        translation: localeEn
    },
    es: {
        translation: localeEs
    },
    fr: {
        translation: localeFr
    },
    it: {
        translation: localeIt
    },
    ko: {
        translation: localeKo
    },
    pt: {
        translation: localePt
    },
    pl: {
        translation: localePl
    },
    th: {
        translation: localeTh
    },
    zhhans: {
        translation: localeZhHans
    },
    zhhant: {
        translation: localeZhHant
    }
};

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources,
        fallbackLng: 'en',
        debug: false, //(process.env.NODE_ENV !== 'production'),
        //lng: 'en',
        interpolation: {
            escapeValue: false
        },
        keySeparator: false,
        nsSeparator: false,
        detection: {
            // order and from where user language should be detected
            order: ['cookie', 'localStorage', 'navigator'],
            lookupCookie: 'i18next',
            lookupLocalStorage: 'i18nextLng',

            // cache user language on
            caches: ['localStorage', 'cookie'],

            // optional expire and domain for set cookie
            cookieMinutes: 1000000
        }
    });

export default i18n;
