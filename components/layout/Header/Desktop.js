import React from 'react'
import { useCallback, useState, useEffect } from 'react'
import Headroom from 'react-headroom'
import styled from 'styled-components'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { logout } from '@/helpers/services/restService'
import { showAsyncToast } from '@/actions'
import Cookie from 'js-cookie'
import { COOKIES } from '@/helpers/services/loginService'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { isCurrentPath } from '@/utils/routing/isCurrentPath'
import { getGeoDataStr } from '@/utils/geo/getGeoDataStr'
import { Button } from '@/ui-kit/atoms'
import { MenuModal } from './components/MenuModal'
import { useUnscrolledBody } from '@/hooks/use-unscrolled-body'
import { ThemeToggler } from '../ThemeToggler'

const Nav = styled('div')`
  font-size: 16px;
  font-weight: 500;

  padding: 0;
  color: #fff;
  background-color: #0162c8;
  > ul {
    max-width: calc(960px + 40px);

    display: flex;
    list-style: none;
    margin: 0 auto;
    padding: 0;
    line-height: 50px;
    font-size: 16px;
  }
  > ul > li {
    margin-right: 1rem;
  }
  > ul > li:first-child {
    margin-left: auto;
  }
  > ul > li > a {
    text-decoration: none;
    color: #fff;
    display: block;
    height: 100%;
  }
  > ul > li.active > a {
    color: yellow;
    // color: #FFDF64;
  }
  > ul > li > a.selected {
    color: red;
  }
  > ul > li > .login-btn {
  }
  @media (max-width: 767px) {
    display: none;
  }
`
const MenuFlexWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const getIPs = (items) =>
  items.map(({ ip, geo }) => `${ip}${getGeoDataStr(geo)}`).join(`
`)

const DesktopHeader = () => {
  const usersConnected = useSelector((state) => state.users?.items)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    const token = Cookie.get(COOKIES.authToken)

    if (!!token) setIsAuthenticated(true)
    setIsLoaded(true)
  }, [])
  const handleLogoutCb = useCallback(async () => {
    await logout()
      .then(() => {
        dispatch(showAsyncToast({ text: 'LOGOUT', delay: 3000, type: 'success' }))
        router.push('/auth/login')
      })
      .catch((msg) => {
        dispatch(showAsyncToast({ text: msg, delay: 20000, type: 'error' }))
      })
  }, [dispatch, showAsyncToast])
  const handleLogout = useDebouncedCallback(() => {
    handleLogoutCb()
  }, 500)
  const isCurrentPathCb = useCallback(isCurrentPath, [])
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const { onBlockScrollBody } = useUnscrolledBody(false)
  const handleMenuOpen = useCallback(() => {
    onBlockScrollBody(true)
    setIsMenuOpened(true)
  }, [])
  const handleMenuClose = useCallback(() => {
    onBlockScrollBody(false)
    setIsMenuOpened(false)
  }, [])

  return (
    <>
      <Headroom style={{ zIndex: 5 }}>
        <header style={{ boxShadow: '0 0 4px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.28)' }}>
          <Nav>
            <ul style={{ textTransform: 'uppercase', letterSpacing: '.1em' }}>
              <li style={{ marginLeft: '20px', marginBottom: '0px' }}>
                <Link href="/" as="/">
                  <a
                    style={{
                      color: `white`,
                      textDecoration: `none`,
                    }}
                  >
                    Pravosleva
                  </a>
                </Link>
              </li>
              <li style={{ margin: '0 auto 0 0' }} className="muted">
                {usersConnected.length > 0 && (
                  <span title={getIPs(usersConnected)}>
                    <i className="fas fa-globe" style={{ marginRight: '15px' }}></i>Online: {usersConnected.length}
                  </span>
                )}
              </li>
              <ThemeToggler />
              {isLoaded && !isAuthenticated && (
                <li className="fade-in-effect" style={{ marginLeft: '0px', marginRight: '20px', marginBottom: '0px' }}>
                  <Link href="/auth/login" as="/auth/login">
                    <a style={{ color: isCurrentPathCb(router.pathname, '/auth/login') ? 'yellow' : '#FFF' }}>Login</a>
                  </Link>
                </li>
              )}
              {isLoaded && isAuthenticated && (
                <li style={{ marginLeft: '0px', marginRight: '20px', marginBottom: '0px' }} onClick={handleLogout}>
                  <a href="#">Logout</a>
                </li>
              )}
              <li style={{ marginRight: '20px', marginBottom: '0px' }}>
                <MenuFlexWrapper>
                  <Button onClick={handleMenuOpen} typeName="orange" width="narrow" size="xsmall">
                    Menu
                  </Button>
                </MenuFlexWrapper>
              </li>
            </ul>
          </Nav>
        </header>
      </Headroom>
      <MenuModal isOpened={isMenuOpened} onHideModal={handleMenuClose} isAuthenticated={isAuthenticated} />
    </>
  )
}

export default DesktopHeader
