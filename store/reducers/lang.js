import { createSymbiote } from 'redux-symbiote'
import intl from 'react-intl-universal'
// https://github.com/alibaba/react-intl-universal
import cookie from 'js-cookie'

import enUS from '@/public/static/locales/en-US.json'
import ruRU from '@/public/static/locales/ru-RU.json'
// Others...

const SUPPOER_LOCALES = [
  {
    label: 'RU',
    name: 'Русский',
    value: 'ru-RU',
  },
  {
    label: 'EN',
    name: 'English',
    value: 'en-US',
  },
  // Others...
]
const getDeafultLang = () => {
  let langFromCookies

  if (typeof window) langFromCookies = cookie.get('lang')

  return langFromCookies || 'ru-RU'
}
const translateFnInit = (lang) => {
  let langFromCookies

  if (typeof window) langFromCookies = cookie.get('lang')

  intl
    .init({
      currentLocale: lang ? lang : langFromCookies ? langFromCookies : 'ru-RU',
      locales: {
        'ru-RU': ruRU,
        'en-US': enUS,
        // Others...
      },
    })
    .then(() => {
      // Default example comment: After loading CLDR locale data, start to render
      // For example: initDone -> true
    })
    .catch((err) => {
      // console.log(err)
    })
  return (str) => intl.get(str)
}
translateFnInit() // First init

export const initialState = {
  current: getDeafultLang(),
  suppoerLocales: SUPPOER_LOCALES,
}

export const { actions: langActions, reducer: lang } = createSymbiote(
  initialState,
  {
    // fillDelta: (state, payload) => ({ ...state, ...payload }),
    set: (state, payload) => {
      translateFnInit(payload) // Updated!

      return {
        ...state,
        current: payload,
      }
    },
  },
  'lang'
)
