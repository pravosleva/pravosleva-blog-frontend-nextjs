import React, { useCallback } from 'react'
import { Modal } from '@/ui-kit'
// import { FooterRow } from '@/ui-kit/molecules/Modal/FooterRow'
// import { Button } from '@/ui-kit/atoms'
import Link from 'next/link'
import { isCurrentPath } from '@/utils/routing/isCurrentPath'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { withTranslator } from '@/hocs/with-translator'

interface IProps {
  isOpened: boolean
  onHideModal: () => void
  isAuthenticated: boolean
  t: (text: string) => string
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

export const MenuModal = withTranslator(({ isOpened, onHideModal, isAuthenticated, t }: IProps) => {
  const router = useRouter()
  const isCurrentPathCb = useCallback((path) => isCurrentPath(router.pathname, path), [router.pathname])

  return (
    <>
      {isOpened && (
        <Modal
          size="small"
          modalTitle={t('MENU')}
          // modalSubtitle="process.env"
          closeModal={onHideModal}
          renderBodyContent={() => menuItems({ isCurrentPathCb, isAuthenticated, t })}
          // renderFooterContent={() => (
          //   <FooterRow>
          //     <Button typeName="blue" size="small" width="narrow" onClick={onHideModal}>
          //       Закрыть
          //     </Button>
          //   </FooterRow>
          // )}
        />
      )}
    </>
  )
})
