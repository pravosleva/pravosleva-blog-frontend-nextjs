import { createSymbiote } from 'redux-symbiote'
import intl from 'react-intl-universal'
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
const translateFnInit = (lang) => {
  intl
    .init({
      currentLocale: lang || 'en-US',
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
  current: 'en-US',
  suppoerLocales: SUPPOER_LOCALES,
}

export const { actions: langActions, reducer: lang } = createSymbiote(
  initialState,
  {
    set: (state, payload) => {
      translateFnInit(payload)

      return {
        ...state,
        current: payload,
      }
    },
    reset: () => {
      translateFnInit()

      return { ...initialState }
    },
  },
  'lang'
)
