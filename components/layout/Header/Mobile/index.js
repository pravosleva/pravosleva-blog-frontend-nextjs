import React, { useCallback } from 'react'
import Headroom from 'react-headroom'
import styled, { keyframes, css } from 'styled-components'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { withMobileMenu } from './hocs/with-mobile-menu'
import { HamburgerIcon, CrossCloseIcon } from './components'
// import Cookie from 'js-cookie'
// import { COOKIES } from '@/helpers/services/loginService'
import { showAsyncToast } from '@/actions'
import { logout } from '@/helpers/services/restService'
import { useRouter } from 'next/router'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { isCurrentPath } from '@/utils/routing/isCurrentPath'
import { ThemeToggler } from '../../ThemeToggler'
import { withTranslator } from '@/hocs/with-translator'
import { LangLink } from '../components/LangLink'
import { userInfoActions } from '@/store/reducers/user-info'

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

  // Translator:
  t,
  setLang,
  suppoerLocales, // Array like this: [{ label, name, value }]
  currentLang,
}) => {
  const isAuthenticated = !!useSelector((state) => state.userInfo?.fromServer?.id)
  const dispatch = useDispatch()
  const router = useRouter()

  // const [isLoaded, setIsLoaded] = useState(false)
  // const [isAuthenticated, setIsAuthenticated] = useState(false)
  // useEffect(() => {
  //   const token = Cookie.get(COOKIES.authToken)

  //   if (!!token) setIsAuthenticated(true)
  //   setIsLoaded(true)
  // }, [])
  const handleLogoutCb = useCallback(async () => {
    await logout()
      .then(() => {
        // dispatch(showAsyncToast({ text: 'LOGOUT', delay: 3000, type: 'success' }))
        router.push('/auth/login')
      })
      .catch((msg) => {
        dispatch(showAsyncToast({ text: msg, delay: 20000, type: 'error' }))
      })
  }, [dispatch, showAsyncToast])
  const handleLogout = useDebouncedCallback(() => {
    handleLogoutCb().then(() => {
      dispatch(userInfoActions.fillDelta({ fromServer: null, isLoadedSuccessfully: true }))
    })
  }, 500)
  const isCurrentPathCb = useCallback(isCurrentPath, [])
  const handleSetLang = useCallback(
    (value) => (e) => {
      e.preventDefault()
      setLang(value)
    },
    []
  )

  return (
    <Headroom>
      <header style={{ boxShadow: '0 0 4px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.28)' }}>
        <Nav ref={topDocRef}>
          <ul style={{ textTransform: 'uppercase', letterSpacing: '.1em' }}>
            <li
              style={{
                marginLeft: '20px',
                marginRight: 'auto',
                marginBottom: '0px',
                fontFamily: 'Montserrat',
                // fontWeight: '500',
                fontSize: '0.8em',
              }}
              onClick={() => sidebarToggler(false)}
            >
              <Link href="/" as="/">
                <a style={{ lineHeight: '40px' }}>Pravo$leva</a>
              </Link>
            </li>
            {!!suppoerLocales &&
              suppoerLocales.length > 0 &&
              suppoerLocales.map((lang) => (
                <li
                  key={lang.label}
                  style={{
                    minWidth: '45px',
                    // marginLeft: '15px', marginRight: '15px',
                    marginBottom: '0px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: '500',
                  }}
                >
                  <Link href="/">
                    <LangLink
                      isCurrentSelection={lang.value === currentLang}
                      onClick={handleSetLang(lang.value)}
                      title={lang.name}
                    >
                      {lang.label}
                    </LangLink>
                  </Link>
                </li>
              ))}
            <ThemeToggler />
            {!isAuthenticated && (
              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  // marginLeft: '10px',
                  // marginRight: '10px',
                  minWidth: '40px',
                  marginBottom: '0px',
                  fontFamily: 'Montserrat',
                }}
                className="fade-in-effect"
              >
                <Link href="/auth/login">
                  <a
                    style={{
                      color: isCurrentPathCb(router.pathname, '/auth/login') ? '#ff781e' : '#FFF',
                      height: '100%',
                    }}
                    className={`${!isCurrentPathCb(router.pathname, '/auth/login') ? ' muted no-muted-on-hover' : ''}`}
                  >
                    <span style={{ height: '100%' }}>
                      <i className="fas fa-fingerprint"></i>
                    </span>
                  </a>
                </Link>
              </li>
            )}
            {isAuthenticated && (
              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // marginLeft: '15px',
                  minWidth: '40px',
                  marginBottom: '0px',
                  fontFamily: 'Montserrat',
                }}
                className="fade-in-effect"
                onClick={handleLogout}
              >
                <a href="#">
                  <i class="fas fa-sign-out-alt"></i>
                </a>
              </li>
            )}
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

export default withMobileMenu(withTranslator(MobileHeader))
