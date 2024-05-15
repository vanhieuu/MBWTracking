import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import {en_US, resources, vi_VN} from './locales';
import i18next from 'i18next';


/**
 * Config i18n for app
 */
i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  interpolation: {
    // React already does escaping
    escapeValue: false,
  },
  lng:'vi',
  resources: {
    en:en_US,
    vi:vi_VN
  },
  defaultNS: 'common',
  fallbackNS: 'common',
});


export default i18n;
