import Headroom from 'react-headroom';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';


/*
- 320-767 - mobile
- 768-1023 - tablet
- 1024-1279 - laptop
- 1280+ - desktop
*/

const slideDownEffect = keyframes`
  0%{transform:translateY(-60px)}90%{transform:translateY(0)}100%{transform:translateY(0)}
`;
const Nav = styled('div')`
  font-size: 16px;
  font-weight: 500;

  padding: 0;
  color: #fff;
  background-color: #2E65B2;
  > ul {
    max-width: 960px;

    display: flex;
    list-style: none;
    margin: 0 auto;
    padding: 0;
    line-height: 80px;
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
  > ul > li > .login-btn {}
  @media(max-width: 767px) {
    display: none;
  }
`;

// const rightItems = [
//   { path: '/cabinet', label: name => <span><Icon icon='user-circle-o' size="lg" /> {name.toUpperCase()}</span>, id: 1, accessForRoles: ['public', 'authenticated'] },
// ];

const DesktopHeader = () => {
  return (
    <Headroom>
      <header
        style={{ boxShadow: '0 0 4px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.28)' }}
      >
        <Nav>
          <ul>
            <li style={{ marginLeft: '20px', marginRight: 'auto', marginBottom: '0px' }}>
              <h1 style={{ margin: 0, lineHeight: 'inherit' }}>
                <Link href='/'>
                  <a
                    style={{
                      color: `white`,
                      textDecoration: `none`,
                    }}
                  >Pravosleva</a>
                </Link>
              </h1>
            </li>
          </ul>
        </Nav>
      </header>
    </Headroom>
  );
}

export default DesktopHeader;
