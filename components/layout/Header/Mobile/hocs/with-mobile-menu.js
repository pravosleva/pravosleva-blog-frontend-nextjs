import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { compose, withStateHandlers, withProps } from 'recompose';
import styled, { css } from 'styled-components';
import Link from 'next/link';


import { scrollDisablingComponentsActions } from '../../../../../store/reducer/scroll-disabling-components';
import { withScrollDisabler } from '../../../../../helpers/body-scroll-disabler';


const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  @media(max-width: 767px){
    top: 0; bottom: 0;
    position: relative;
  }
  box-sizing: border-box;
`;

const Sidebar = styled.div`
  background-color: white;
  overflow-y: auto;
  @media(min-width: 768px){
    display: none;
  }
  @media(max-width: 767px){
    min-height: calc(100vh - 40px); height: 100%;
    min-width: 100%;
    width: 100%;
    transform: translateX(0);
    transition: transform 0.5s ease-in-out, opacity 0.7s ease-in-out;
    // border: 1px solid black;
    background-color: #007bff;
    // background-color: #2d4262
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
    }

    ${(p) => !p.opened && css`
      transform: translateX(-100%);
      opacity: 0;
    `}
    position: absolute; top: 40px;
    overflow-x: hidden;
  }
  box-sizing: border-box;
  z-index: 3;
`;

const items = [
  // { path: '/cabinet', label: 'Личный кабинет', id: 0, accessForRoles: ['public', 'authenticated'] },
  { path: '/profile', label: 'Profile', id: 1, accessForRoles: ['public', 'authenticated'] },
  { path: '/login', label: 'Login', id: 2, accessForRoles: ['public', 'authenticated'] },
  // { path: '/graphql-sample', label: 'GraphQL', id: 3, accessForRoles: ['free'] },
];

export const withMobileMenu = (ComposedComponent) => compose(
  withProps({
    topDocRef: React.createRef(),
  }),
  withStateHandlers(
    { sidebarOpened: false },
    {
      sidebarToggler: ({ sidebarOpened }, props) => val => {
        // Need to scroll top:
        if (window) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }

        return ({
          sidebarOpened: (val === true || val === false )
            ? val
            : !sidebarOpened
        })
      }
    },
  ),
  withScrollDisabler,
)(({
  // Sidebar hoc:
  sidebarOpened,
  topDocRef,
  sidebarToggler,

  // Scroll disabler hoc (topDocRef used there):
  scrollToRef,

  ...props
}) => {
  const dispatch = useDispatch();
  // const user = useSelector(state => state.userInfo.fromServer);
  // const userInfoRole = user ? user.role : null;

  useEffect(() => {
    if (sidebarOpened) {
      // scrollToRef(topDocRef);
      dispatch(scrollDisablingComponentsActions.add('Layout_Header_Mobile_hocs_with-mobile-menu'));
    } else {
      dispatch(scrollDisablingComponentsActions.remove('Layout_Header_Mobile_hocs_with-mobile-menu'));
      // Or this:
      // dispatch(scrollDisablingComponentsActions.reset());
    }
  }, [
    sidebarOpened,
    // scrollToRef,
    dispatch,
    topDocRef,
  ]);

  return (
    <Wrapper opened={sidebarOpened}>
      <Sidebar opened={sidebarOpened}>
        <ul>
          {[...items].map(({ id, path, label, accessForRoles }) => {

            if (accessForRoles.includes('free')) {
              return (
                <li
                  key={id}
                  onClick={() => sidebarToggler()}
                >
                  <Link href={path}><a>{label}</a></Link>
                </li>
              )
            } else {
              // For current user:
              // if (userInfoRole && userInfoRole.type && accessForRoles.includes(userInfoRole.type)) {
              //   return (
              //     <li key={id}>
              //       <Link href={path} onClick={sidebarToggler}><a>{label}</a></Link>
              //     </li>
              //   )
              // } else {
                return null;
              // }
            }
          })}
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
});
