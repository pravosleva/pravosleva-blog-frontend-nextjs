import { useEffect, useState, useCallback } from 'react'
import Headroom from 'react-headroom'
import styled, { keyframes, css } from 'styled-components'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { withMobileMenu } from './hocs/with-mobile-menu'
import { HamburgerIcon, CrossCloseIcon } from './components'
import Cookie from 'js-cookie'
import { COOKIES } from '@/helpers/services/loginService'
import { showAsyncToast } from '@/actions'
import { logout } from '@/helpers/services/restService'
import { useRouter } from 'next/router'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { isCurrentPath } from '@/utils/routing/isCurrentPath'

// Could be used if !ssr
export const MobileHeaderLoader = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
  @media (max-width: 767px) {
    height: 40px;
    background-color: transparent;
  }
`
const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  // width: 32px;
  height: 100%;
  background: transparent;
  ${(p) =>
    p.sidebarOpened &&
    css`
      margin-right: 0;
    `}
`
const slideDownEffect = keyframes`
  0%{transform:translateY(-60px)}90%{transform:translateY(0)}100%{transform:translateY(0)}
`
const Nav = styled('div')`
  padding: 0;
  color: #fff;
  // background-color: #007bff;
  background-color: #0162c8;
  // background-color: #d24136;
  > ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    line-height: 40px;
    font-size: 16px;
  }
  > ul > li {
    // margin-right: 1rem;
  }
  > ul > li:first-child {
    margin-left: auto;
  }
  > ul > li:last-child {
    margin-right: 0;
  }
  > ul > li > a {
    text-decoration: none;
    color: #fff;
  }
  > ul > li > .login-btn-m {
    text-decoration: none;
    color: #fff;
    background-color: transparent;
  }
  @media(min-width: 768px) {
    display: none;
  }
  // animation:${slideDownEffect} 1s 1;
`
// const isCurrentLocation = (current, mayBe) => current === mayBe;
// const getSlicedText = ({ text, limit = 7 }) => {
//   let sliced = text.slice(0, limit);
//
//   if (sliced.length < text.length) sliced += '...';
//
//   return sliced;
// };

const MobileHeader = ({
  // withMobileMenu:
  sidebarToggler,
  sidebarOpened,
  topDocRef,
}) => {
  const usersConnected = useSelector((state) => state.users.items)
  const dispatch = useDispatch()
  const router = useRouter()

  const [isLoaded, setIsLoaded] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  useEffect(() => {
    const token = Cookie.get(COOKIES.authToken)

    if (!!token) setIsAuthenticated(true)
    setIsLoaded(true)
  }, [])
  const handleLogoutCb = useCallback(async () => {
    // handleProfileMenuClose()
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

  return (
    <Headroom>
      <header
        // className='slide-down-effect'
        style={{ boxShadow: '0 0 4px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.28)' }}
      >
        <Nav ref={topDocRef}>
          <ul style={{ textTransform: 'uppercase', letterSpacing: '.1em' }}>
            <li
              style={{
                marginLeft: '20px',
                marginRight: 'auto',
                marginBottom: '0px',
                fontFamily: 'Montserrat',
                fontWeight: '500',
                // To be yellow or not?
                // color: isCurrentLocation(location.pathname, '/')
                //   ? 'yellow' // '#FFDF64'
                //   : 'inherit',
              }}
              onClick={() => sidebarToggler(false)}
            >
              <Link href="/">
                <a style={{ lineHeight: '40px' }}>
                  Pravo$leva{' '}
                  <span className="muted">
                    <i className="fas fa-globe"></i> {usersConnected.length}
                  </span>
                </a>
              </Link>
            </li>

            {isLoaded && !isAuthenticated && (
              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',

                  // TMP: For centering (no burger menu):
                  // marginRight: '20px',
                  marginBottom: '0px',
                  fontFamily: 'Montserrat',
                }}
              >
                <Link href="/auth/login">
                  <a style={{ color: isCurrentPathCb(router.pathname, '/auth/login') ? 'yellow' : '#FFF' }}>Login</a>
                </Link>
              </li>
            )}
            {isLoaded && isAuthenticated && (
              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',

                  // TMP: For centering (no burger menu):
                  // marginRight: '20px',
                  marginBottom: '0px',
                  fontFamily: 'Montserrat',
                }}
                onClick={handleLogout}
              >
                <a href="#">Logout</a>
              </li>
            )}
            {/*
              isUserLogged && (
                <>
                  <li style={{
                    marginLeft: '20px',
                    marginRight: 'auto',

                    // TMP: For centering:
                    marginLeft: '0',
                  }}>
                    <Link
                      to='/cabinet'
                      onClick={() => sidebarToggler(false)}
                    >{getPersonalLabel(username)}</Link>
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <button
                      onClick={() => {
                        // logout()
                        //   .then(() => cookies.remove('jwt'))
                        //   .then(() => dispatch(userInfoActions.reset()))
                        //   .then(() => history.push('/'));
                      }}
                      className="login-btn-m"
                    >Выход</button>
                  </li>
                </>
              )
            */}
            <li
              style={{
                marginBottom: '0px',

                display: 'flex',
                alignItems: 'center',
              }}
            >
              <HamburgerButton onClick={sidebarToggler} sidebarOpened={sidebarOpened}>
                {sidebarOpened ? <CrossCloseIcon /> : <HamburgerIcon />}
              </HamburgerButton>
            </li>
          </ul>
        </Nav>
      </header>
    </Headroom>
  )
}

export default withMobileMenu(MobileHeader)
