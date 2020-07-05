import React, { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { compose, withStateHandlers, withProps } from 'recompose'
import styled, { css } from 'styled-components'
import Link from 'next/link'
import { scrollDisablingComponentsActions } from '@/store/reducers/scroll-disabling-components'
import { withScrollDisabler } from '@/hocs/body-scroll-disabler'
import { isCurrentPath } from '@/utils/routing/isCurrentPath'
import { logout } from '@/helpers/services/restService'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { showAsyncToast } from '@/actions'
import { withTranslator } from '@/hocs/with-translator'
import { userInfoActions } from '@/store/reducers/user-info'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  @media (max-width: 767px) {
    top: 0;
    bottom: 0;
    position: relative;
  }
  box-sizing: border-box;
`

const Sidebar = styled.div`
  background-color: white;
  overflow-y: auto;
  @media (min-width: 768px) {
    display: none;
  }
  @media (max-width: 767px) {
    min-height: calc(100vh - 40px);
    height: 100%;
    min-width: 100%;
    width: 100%;
    transform: translateX(0);
    transition: transform 0.5s ease-in-out, opacity 0.7s ease-in-out;
    background-color: #0162c8;
    > ul {
      margin: 0;
      padding: 0;
    }
    > ul > li {
      margin: 0;
      padding: 10px 10px 10px 20px;
      list-style-type: none;
    }
    > ul > li > a {
      color: #fff;
      text-decoration: none;
      text-transform: uppercase;
      font-size: 0.9em;
      letter-spacing: 0.1em;
    }
    > ul > li > a.active {
      color: #ff781e;
    }

    ${(p) =>
      !p.opened &&
      css`
        transform: translateX(-100%);
        opacity: 0;
      `}
    position: absolute;
    top: 40px;
    overflow-x: hidden;
  }
  box-sizing: border-box;
  z-index: 3;
`

/* TODO:
const items = [
  // { path: '/cabinet', label: 'Личный кабинет', id: 0, accessForRoles: ['public', 'authenticated'] },
  { path: '/profile', label: 'Profile', id: 1, accessForRoles: ['authenticated'] }, // 'public', 'authenticated', 'free'
  // { path: '/login', label: 'Login', id: 2, accessForRoles: ['unauthenticated'] },
  // { path: '/graphql-sample', label: 'GraphQL', id: 3, accessForRoles: ['free'] },
]
*/

export const withMobileMenu = (ComposedComponent) =>
  compose(
    withTranslator,
    withProps({
      topDocRef: React.createRef(),
    }),
    withStateHandlers(
      { sidebarOpened: false },
      {
        sidebarToggler: ({ sidebarOpened }, props) => (val) => {
          // Need to scroll top:
          if (window) {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          }

          return {
            sidebarOpened: val === true || val === false ? val : !sidebarOpened,
          }
        },
      }
    ),
    withScrollDisabler
  )(
    ({
      // Sidebar hoc:
      sidebarOpened,
      topDocRef,
      sidebarToggler,

      // Scroll disabler hoc (topDocRef used there):
      scrollToRef,

      // Translator:
      t,
      setLang,
      suppoerLocales, // Array like this: [{ label, name, value }]
      currentLang,

      ...props
    }) => {
      const usersConnected = useSelector((state) => state.users?.items)
      const isAuthenticated = !!useSelector((state) => state.userInfo?.fromServer?.id)
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
      }, [dispatch, showAsyncToast])
      const handleLogout = useDebouncedCallback(() => {
        handleLogoutCb().then(() => {
          dispatch(userInfoActions.fillDelta({ fromServer: null, isLoadedSuccessfully: true }))
        })
      }, 500)

      useEffect(() => {
        if (sidebarOpened) {
          dispatch(scrollDisablingComponentsActions.add('Layout_Header_Mobile_hocs_with-mobile-menu'))
        } else {
          dispatch(scrollDisablingComponentsActions.remove('Layout_Header_Mobile_hocs_with-mobile-menu'))
        }
      }, [
        sidebarOpened,
        // scrollToRef,
        dispatch,
        topDocRef,
      ])

      const router = useRouter()
      const isCurrentPathCb = useCallback(isCurrentPath, [])

      return (
        <Wrapper opened={sidebarOpened}>
          <Sidebar opened={sidebarOpened}>
            <ul className="bold">
              <li>
                <span className="muted" style={{ fontSize: '0.9em', fontWeight: '500' }}>
                  <span>ONLINE</span>
                  <i className="fas fa-globe" style={{ marginLeft: '15px', marginRight: '15px' }}></i>
                  {usersConnected?.length}
                </span>
              </li>
              {!isAuthenticated && (
                <li>
                  <Link href="/auth/login" as="/auth/login">
                    <a className={isCurrentPathCb(router.pathname, '/auth/login') ? 'active' : ''}>{t('LOGIN')}</a>
                  </Link>
                </li>
              )}
              {isAuthenticated && (
                <li>
                  <Link href="/profile" as="/profile">
                    <a className={isCurrentPathCb(router.pathname, '/profile') ? 'active' : ''}>{t('PROFILE')}</a>
                  </Link>
                </li>
              )}
              <li>
                <Link href="/feedback">
                  <a className={isCurrentPathCb(router.pathname, '/feedback') ? 'active' : ''}>{t('FEEDBACK')}</a>
                </Link>
              </li>
              {isAuthenticated && (
                <li onClick={handleLogout}>
                  <a
                    className={isCurrentPathCb(router.pathname, '/auth/login') ? 'active' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    {t('LOGOUT')}
                  </a>
                </li>
              )}
            </ul>
          </Sidebar>
          <ComposedComponent
            {...props}
            sidebarOpened={sidebarOpened}
            sidebarToggler={sidebarToggler}
            // scrollToRef={scrollToRef}
          />
        </Wrapper>
      )
    }
  )
