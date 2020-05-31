import Headroom from 'react-headroom';
import styled, { keyframes, css } from 'styled-components';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';

import { withMobileMenu } from './hocs/with-mobile-menu';
import { HamburgerIcon, CrossCloseIcon } from './components';
import { logout } from '../../../../hocs/auth/fns';
import { userInfoActions } from '../../../../store/reducer/user-info';
// import { withAuthSync } from '../../../../hocs/auth/page-auth-hoc';


// Could be used if !ssr
export const MobileHeaderLoader = styled.div`
  @media(min-width: 768px) {
    display: none;
  }
  @media(max-width: 767px) {
    height: 40px;
    background-color: transparent;
  }
`;
const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  // width: 32px;
  height: 100%;
  background: transparent;
  ${p => p.sidebarOpened && css`
    margin-right: 0;
  `}
`;
const slideDownEffect = keyframes`
  0%{transform:translateY(-60px)}90%{transform:translateY(0)}100%{transform:translateY(0)}
`;
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
`;
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
  const user = useSelector(state => state.userInfo.fromServer);
  const isUserLogged = (user && user ? user.id : null);
  const dispatch = useDispatch();

  return (
    <Headroom>
      <header
        // className='slide-down-effect'
        style={{ boxShadow: '0 0 4px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.28)' }}
      >
        <Nav ref={topDocRef}>
          <ul>
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
              <Link href='/'><a>Pravo$leva</a></Link>
            </li>

            {
              !isUserLogged
                ? (
                <li style={{
                  display: 'flex',
                  alignItems: 'center',

                  // TMP: For centering (no burger menu):
                  // marginRight: '20px',
                  marginBottom: '0px',
                  fontFamily: 'Montserrat',
                }}>
                  <Link href='/login'><a>Login</a></Link>
                </li>
              ) : (
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',

                    // TMP: For centering (no burger menu):
                    // marginRight: '20px',
                    marginBottom: '0px',
                    fontFamily: 'Montserrat',
                  }}
                  onClick={() => {
                    dispatch(userInfoActions.reset());
                    logout();
                  }}
                >
                  <a href='#'>Logout</a>
                </li>
              )
            }
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
              <HamburgerButton
                onClick={sidebarToggler}
                sidebarOpened={sidebarOpened}
              >
                {
                  sidebarOpened
                  ? <CrossCloseIcon />
                  : <HamburgerIcon />
                }
              </HamburgerButton>
            </li>
          </ul>
        </Nav>
      </header>
    </Headroom>
  );
}

export default withMobileMenu(MobileHeader);
