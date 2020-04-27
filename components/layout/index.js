import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DesktopHeader from './Header/Desktop';
import MobileHeader from './Header/Mobile';
import '../../css/layout.css';
import '../../css/tiles.css';
import '../../css/block-quotes.css';
import '../../css/react-image-lightbox.css';
import '../../css/react-photo-gallery.css';
import '../../css/custom-breadcrumbs.css';
import { withSocketApi } from '../../hocs/with-socket-api';
import { ScrollTopBtn } from './ScrollTopBtn'


const Layout = ({ children }) => {
  const [showScroll, setShowScroll] = useState(false);
  const isBrowser = typeof window !== 'undefined';
  const checkScrollTop = () => {
    if (!showScroll && isBrowser && window.pageYOffset > 200) {
      setShowScroll(true);
    } else if (showScroll && isBrowser && window.pageYOffset <= 200) {
      setShowScroll(false);
    }
  };
  const scrollTop = () => {
    if (isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  if (isBrowser) window.addEventListener('scroll', checkScrollTop);

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
      <ScrollTopBtn
        onClick={scrollTop}
        isShowed={showScroll}
      >
        <i className='fas fa-arrow-up'></i>
      </ScrollTopBtn>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default withSocketApi(Layout);
