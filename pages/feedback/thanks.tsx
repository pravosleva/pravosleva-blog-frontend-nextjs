import React from 'react'
import { Layout } from '@/components/layout'
import styled, { StyledComponent } from 'styled-components'
import Link from 'next/link'

const Container: StyledComponent<'div', any, {}, never> = styled('div')`
  @media (min-width: 768px) {
    padding: 0;
    max-width: 400px;
    margin: 0 auto;
  }
  @media (max-width: 767px) {
    padding: 20px;
  }
  > .special-link-wrapper,
  > h2 {
    text-align: center;
  }
`

const Thanks = () => {
  return (
    <Layout>
      <Container className="box">
        <h2>Thanks for your feedback</h2>
        <div className="special-link-wrapper fade-in-effect unselectable">
          <Link href="/" as="/">
            <a className="link-as-rippled-btn">
              <i className="fas fa-arrow-left"></i>
              <span style={{ marginLeft: '10px' }}>Go back to the homepage</span>
            </a>
          </Link>
        </div>
      </Container>
    </Layout>
  )
}

export default Thanks
