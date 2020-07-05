import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Cookie from 'js-cookie'
import intl from 'react-intl-universal'
import { langActions } from '@/store/reducers/lang'
import { IRootState } from '@/store/reducers/IRootState'

const langCookieExpiresDays = !!process.env.REACT_APP_LANG_COOKIE_EXPIRES_DAYS
  ? Number(process.env.REACT_APP_LANG_COOKIE_EXPIRES_DAYS)
  : 1

export const withTranslator = (WrappedComponent: any) => {
  const Wrapper = (props: any) => {
    const current = useSelector((state: IRootState) => state.lang.current)
    const suppoerLocales = useSelector((state: IRootState) => state.lang.suppoerLocales)
    const dispatch = useDispatch()

    useEffect(() => {
      const fromCookie = Cookie.get('lang')

      if (!!fromCookie) dispatch(langActions.set(fromCookie))
    }, [])

    // useEffect(() => {
    //   Cookie.set('lang', current, { expires: langCookieExpiresDays })
    // }, [current])

    const handleSetLang = useCallback((key: string) => {
      dispatch(langActions.set(key))
      Cookie.set('lang', key, { expires: langCookieExpiresDays })
    }, [])

    return (
      <WrappedComponent
        {...props}
        setLang={handleSetLang}
        currentLang={current}
        t={(str: string, opts: any) => intl.get(str, opts)}
        suppoerLocales={suppoerLocales}
      />
    )
  }

  return Wrapper
}
