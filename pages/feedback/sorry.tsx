import React, { useCallback } from 'react'
import { Layout } from '@/components/layout'
import styled, { StyledComponent } from 'styled-components'
import Link from 'next/link'
import { NextPage, NextPageContext } from 'next'
import { withTranslator } from '@/hocs/with-translator'
import NextNProgress from 'nextjs-progressbar'
// <NextNProgress color="#FFF" startPosition={0.3} stopDelayMs={200} height={2} />

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
  > h2,
  > p {
    text-align: center;
  }
`

interface IProps {
  msg: string | string[]
  t?: (text: string) => string
}

const Sorry: NextPage<IProps> = withTranslator(({ msg, t }) => {
  const getMsg = useCallback(() => {
    if (Array.isArray(msg)) {
      return (
        <ul>
          {msg.map((str, i) => (
            <li key={i}>{str}</li>
          ))}
        </ul>
      )
    } else {
      return String(msg)
    }
  }, [])
  return (
    <Layout>
      <NextNProgress color="#FFF" startPosition={0.3} stopDelayMs={200} height={2} options={{ showSpinner: false }} />
      <Container className="box">
        <h2 className="error">{t('SORRY')}</h2>
        <p>
          {getMsg()}
          <br />
          <b>{t('THANKS_FOR_RECAPTHCA_V3_TESTING')}</b>
        </p>
        <div className="special-link-wrapper fade-in-effect unselectable">
          <Link href="/" as="/">
            <a className="link-as-rippled-btn">
              <i className="fas fa-arrow-left"></i>
              <span style={{ marginLeft: '10px' }}>{t('GO_BACK_TO_THE_HOMEPAGE')}</span>
            </a>
          </Link>
        </div>
      </Container>
    </Layout>
  )
})

Sorry.getInitialProps = async ({ query }: NextPageContext): Promise<IProps> => {
  const { msg } = query

  return {
    msg,
  }
}

export default Sorry
