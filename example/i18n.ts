import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enUS from '../src/locales/en-US.json'
import zhCN from '../src/locales/zh-CN.json'

const resources = {
  'en-US': { translation: enUS },
  'zh-CN': { translation: zhCN },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    debug: false,
    lng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
  })
