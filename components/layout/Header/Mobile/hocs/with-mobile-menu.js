import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { compose, withStateHandlers, withProps } from 'recompose'
import styled, { css } from 'styled-components'
import Link from 'next/link'
import { scrollDisablingComponentsActions } from '@/store/reducers/scroll-disabling-components'
import { withScrollDisabler } from '@/hocs/body-scroll-disabler'
import Cookie from 'js-cookie'
import { COOKIES } from '@/helpers/services/loginService'
import { isCurrentPath } from '@/utils/routing/isCurrentPath'

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
      color: yellow;
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

const items = [
  // { path: '/cabinet', label: 'Личный кабинет', id: 0, accessForRoles: ['public', 'authenticated'] },
  { path: '/profile', label: 'Profile', id: 1, accessForRoles: ['authenticated'] }, // 'public', 'authenticated', 'free'
  // { path: '/login', label: 'Login', id: 2, accessForRoles: ['unauthenticated'] },
  // { path: '/graphql-sample', label: 'GraphQL', id: 3, accessForRoles: ['free'] },
]

export const withMobileMenu = (ComposedComponent) =>
  compose(
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

      ...props
    }) => {
      const dispatch = useDispatch()

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

      const [isLoaded, setIsLoaded] = useState(false)
      const [isAuthenticated, setIsAuthenticated] = useState(false)
      useEffect(() => {
        const token = Cookie.get(COOKIES.authToken)

        if (!!token) setIsAuthenticated(true)
        setIsLoaded(true)
      }, [])

      const router = useRouter()
      const isCurrentPathCb = useCallback(isCurrentPath, [])

      return (
        <Wrapper opened={sidebarOpened}>
          <Sidebar opened={sidebarOpened}>
            <ul>
              {isLoaded && isAuthenticated && (
                <li>
                  <Link href="/profile">
                    <a className={isCurrentPathCb(router.pathname, '/profile') ? 'active' : ''}>Profile</a>
                  </Link>
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
