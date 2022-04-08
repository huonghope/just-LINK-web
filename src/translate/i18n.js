import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import translationKo from './ko.json';

const resource = {
  ko: {
    translation: translationKo,
  },
};

i18n.use(initReactI18next).init({
  resources: resource,
  lng: 'ko',
  fallbackLng: 'ko',

  debug: true,
  keySeparator: '.',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
