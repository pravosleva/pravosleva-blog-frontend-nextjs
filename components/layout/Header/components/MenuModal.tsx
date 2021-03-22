import React, { useCallback } from 'react'
import { Modal } from '@/ui-kit'
import { FooterRow } from '@/ui-kit/molecules/Modal/FooterRow'
import { Button } from '@/ui-kit/atoms'
import Link from 'next/link'
import { isCurrentPath } from '@/utils/routing/isCurrentPath'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { withTranslator } from '@/hocs/with-translator'
import Cookie from 'js-cookie'
import { logout } from '@/helpers/services/restService'
import { useDispatch } from 'react-redux'
import { showAsyncToast } from '@/actions'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { userInfoActions } from '@/store/reducers/user-info'
import { useGlobalTheming } from '@/hooks/use-global-theming'
import { cookieOfferActions } from '@/store/reducers/cookie-offer'

interface IProps {
  isOpened: boolean
  onHideModal: () => void
  isAuthenticated: boolean
  t: (text: string) => string
  resetLang: () => void
}

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
`

const menuItems = ({ isCurrentPathCb, isAuthenticated, t }) => (
  <Wrapper>
    {!isCurrentPathCb('/') && (
      <Link href="/" as="/">
        <a>{t('HOME')}</a>
      </Link>
    )}
    {!isAuthenticated && !isCurrentPathCb('/auth/login') && (
      <Link href="/auth/login" as="/auth/login">
        <a>{t('LOGIN')}</a>
      </Link>
    )}
    {!isCurrentPathCb('/feedback') && (
      <Link href="/feedback" as="/feedback">
        <a>reCAPTCHA v3 test</a>
      </Link>
    )}
    {isAuthenticated && !isCurrentPathCb('/profile') && (
      <Link href="/profile" as="/profile">
        <a>{t('PROFILE')}</a>
      </Link>
    )}
    <a href="http://pravosleva.ru/storybook/index.html" rel="noreferrer" target="_blank">
      Storybook
    </a>
  </Wrapper>
)

export const MenuModal = withTranslator(({ isOpened, onHideModal, isAuthenticated, t, resetLang }: IProps) => {
  const router = useRouter()
  const isCurrentPathCb = useCallback((path) => isCurrentPath(router.pathname, path), [router.pathname])
  const dispatch = useDispatch()
  const handleLogoutCb = useCallback(async () => {
    const result = await logout()
      .then(() => {
        router.push('/auth/login')
      })
      .catch((text) => {
        dispatch(showAsyncToast({ text, delay: 20000, type: 'error' }))
      })
    return result
  }, [])
  const handleLogout = useDebouncedCallback(() => {
    handleLogoutCb().then(() => {
      dispatch(userInfoActions.fillDelta({ fromServer: null, isLoadedSuccessfully: true }))
    })
  }, 500)
  const { onReset: resetTheme } = useGlobalTheming()
  const removeAllCookie = useCallback(() => {
    Cookie.remove('lang')
    resetLang()
    resetTheme()
    Cookie.remove('cookie-confirmed')
    dispatch(cookieOfferActions.enable())
    if (isAuthenticated) handleLogout()
    onHideModal()
  }, [])

  return (
    <>
      {isOpened && (
        <Modal
          size="small"
          modalTitle={t('MENU')}
          // modalSubtitle="process.env"
          closeModal={onHideModal}
          renderBodyContent={() => menuItems({ isCurrentPathCb, isAuthenticated, t })}
          renderFooterContent={() => (
            <FooterRow>
              <Button typeName="orange" size="small" width="responsive" onClick={removeAllCookie}>
                {t('REMOVE_ALL_COOKIE_AND_CLOSE')}
              </Button>
            </FooterRow>
          )}
        />
      )}
    </>
  )
})
