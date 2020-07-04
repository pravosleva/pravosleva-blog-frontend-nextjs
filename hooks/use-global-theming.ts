import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookie from 'js-cookie'
import { globalThemeActions } from '@/store/reducers/global-theme'
import { IRootState } from '@/store/reducers/IRootState'

const themes = ['light', 'gray', 'hard-gray', 'dark']
const getNextTheme = (currentTheme: string) => {
  const prevIndex = themes.findIndex((t) => t === currentTheme)

  if (prevIndex !== -1) {
    if (prevIndex === themes.length - 1) {
      return themes[0]
    } else {
      return themes[prevIndex + 1]
    }
  } else {
    return themes[0]
  }
}

export const useGlobalTheming = () => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const dispatch = useDispatch()
  const init = useCallback(() => {
    if (!!window?.document) {
      const theme = Cookie.get('theme')

      if (!!theme) {
        document.body.classList.add(theme)
        dispatch(globalThemeActions.setTheme(theme))
      } else {
        document.body.classList.add(currentTheme)
      }
    }
  }, [])

  useEffect(() => {
    init()
  }, [])

  return {
    currentTheme,
    onSetNextTheme: () => {
      if (!!window?.document) {
        const nextTheme = getNextTheme(currentTheme)
        const toRemove = themes.filter((t) => t !== nextTheme)

        document.body.classList.remove(...toRemove)
        document.body.classList.add(nextTheme)
        dispatch(globalThemeActions.setTheme(nextTheme))
        Cookie.set('theme', nextTheme)
      }
    },
  }
}
