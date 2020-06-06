import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import DesktopHeader from './Header/Desktop';
import MobileHeader from './Header/Mobile';
import '../../css/tiles.css';
import '../../css/block-quotes.css';
import '../../css/react-image-lightbox.css';
import '../../css/react-photo-gallery.css';
import '../../css/custom-breadcrumbs.css';
import { withSocketApi } from '../../hocs/with-socket-api';
import { ScrollTopBtn } from './ScrollTopBtn';
import { useScroll } from '../../hooks/use-scroll';

const Layout = ({ children }) => {
  const [showScroll, setShowScroll] = useState(false);
  const isBrowser = useMemo(() => typeof window !== 'undefined', []);
  const scroll = useScroll();

  useEffect(() => {
    // console.log(scroll);
    if (scroll.y > 200) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  }, [scroll]);

  const scrollTop = useCallback(() => {
    if (isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const fullYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <>
      <DesktopHeader />
      <MobileHeader />
      <div className='universal-container'>
        <main style={{ padding: '20px 0 20px 0' }}>{children}</main>
      </div>
      <footer>
        <div style={{ margin: '0 auto', maxWidth: 960, lineHeight: '50px' }}>
          <span style={{ margin: '0 20px 0 20px' }}>© {fullYear}</span>
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
