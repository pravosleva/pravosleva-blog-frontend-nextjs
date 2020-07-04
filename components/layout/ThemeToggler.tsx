import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGlobalTheming } from '@/hooks/use-global-theming'
import { getThemeIcon } from '@/utils/globalTheme/getThemeIcon'
import { IRootState } from '@/store/reducers/IRootState'

export const ThemeToggler = () => {
  const { onSetNextTheme } = useGlobalTheming()
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const themeIcon = useMemo(() => getThemeIcon(currentTheme), [currentTheme])

  return (
    <li
      onClick={onSetNextTheme}
      style={{ marginLeft: '0px', marginRight: '0px', marginBottom: '0px', cursor: 'pointer' }}
      className="muted no-muted-on-hover"
    >
      <span>
        <i className={themeIcon} style={{ marginLeft: '15px', marginRight: '15px' }}></i>
      </span>
    </li>
  )
}
