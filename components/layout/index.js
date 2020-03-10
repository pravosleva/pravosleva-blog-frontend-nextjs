/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
// import { useStaticQuery, graphql } from 'gatsby';

import DesktopHeader from './Header/Desktop';
import MobileHeader from './Header/Mobile';
import '../../css/layout.css';
// import '../../css/rc-banner-anim.css';
import '../../css/tiles.css';
import '../../css/block-quotes.css';
import '../../css/react-image-lightbox.css';
import '../../css/react-photo-gallery.css';
// import { useSelector, useDispatch } from 'react-redux';
// import { counterActions } from '../store/counter';
import { withSocketApi } from '../../hocs/with-socket-api';


const Layout = ({ children }) => {
  // const count = useSelector(state => state.counter.count);
  // const currentLang = useSelector(state => state.lang.current);
  // const dispatch = useDispatch();

  return (
    <>
      <DesktopHeader />
      <MobileHeader />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0px 20px 20px`,
          paddingTop: 0,
        }}
      >
        <main style={{ paddingTop: '20px', minHeight: 'calc(100vh - 80px)' }}>{children}</main>
      </div>
      <footer>
        <div style={{ margin: `0 auto`, maxWidth: 960, padding: '0px 1.0875rem 1.45rem' }}>
          © {new Date().getFullYear()}
        </div>
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default withSocketApi(Layout);
