import React from "react";
import Link from 'next/link'
import PropTypes from "prop-types";


const Header = ({ siteTitle }) => (
  <header
    style={{
      // background: `#123abc`,
      backgroundImage: 'linear-gradient(-90deg, rgb(0, 123, 255), #123abc)',
      // marginBottom: `1.45rem`,
      lineHeight: '80px',
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        lineHeight: 'inherit',
      }}
    >
      <h1 style={{ margin: 0, lineHeight: 'inherit', padding: '0px 1.0875rem' }}>
        <Link href="/">
          <a
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >{siteTitle}</a>
        </Link>
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: 'Pravosleva',
}

export default Header
