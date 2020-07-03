import React, { useCallback } from 'react'
import { Modal } from '@/ui-kit'
// import { FooterRow } from '@/ui-kit/molecules/Modal/FooterRow'
// import { Button } from '@/ui-kit/atoms'
import Link from 'next/link'
import { isCurrentPath } from '@/utils/routing/isCurrentPath'
import { useRouter } from 'next/router'
import styled from 'styled-components'

interface IProps {
  isOpened: boolean
  onHideModal: () => void
  isAuthenticated: boolean
}

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
`

const menuItems = ({ isCurrentPathCb, isAuthenticated }) => (
  <Wrapper>
    {!isCurrentPathCb('/') && (
      <Link href="/" as="/">
        <a>Home</a>
      </Link>
    )}
    {!isCurrentPathCb('/feedback') && (
      <Link href="/feedback" as="/feedback">
        <a>reCAPTCHA v3 test</a>
      </Link>
    )}
    {!isAuthenticated && !isCurrentPathCb('/auth/login') && (
      <Link href="/auth/login" as="/auth/login">
        <a>Login</a>
      </Link>
    )}
    {isAuthenticated && !isCurrentPathCb('/profile') && (
      <Link href="/profile" as="/profile">
        <a>Profile</a>
      </Link>
    )}
    <a href="http://pravosleva.ru/storybook/index.html" rel="noreferrer" target="_blank">
      Storybook
    </a>
  </Wrapper>
)

export const MenuModal = ({ isOpened, onHideModal, isAuthenticated }: IProps) => {
  const router = useRouter()
  const isCurrentPathCb = useCallback((path) => isCurrentPath(router.pathname, path), [router.pathname])

  return (
    <>
      {isOpened && (
        <Modal
          size="small"
          modalTitle="Menu"
          // modalSubtitle="process.env"
          closeModal={onHideModal}
          renderBodyContent={() => menuItems({ isCurrentPathCb, isAuthenticated })}
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
}
