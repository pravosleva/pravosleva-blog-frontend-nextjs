import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Cookie from 'js-cookie'
import { globalThemeActions } from '@/store/reducers/global-theme'

const themes = ['light', 'gray', 'dark']
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
  const [currentTheme, setCurrentTheme] = useState<string>('light')
  const dispatch = useDispatch()

  useEffect(() => {
    if (!!window?.document) {
      const theme = Cookie.get('theme')

      if (!!theme) setCurrentTheme(theme)
    }
  }, [])

  useEffect(() => {
    if (!!window?.document) {
      const toRemove = themes.filter((t) => t !== currentTheme)

      document.body.classList.remove(...toRemove)
      document.body.classList.add(currentTheme)
      dispatch(globalThemeActions.setTheme(currentTheme))
      Cookie.set('theme', currentTheme)
    }
  }, [currentTheme])

  return {
    currentTheme,
    onSetNextTheme: () => {
      setCurrentTheme(getNextTheme(currentTheme))
    },
  }
}
