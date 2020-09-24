import React from 'react'
import App from 'next/app'
import { Provider } from 'react-redux'
import Router from 'next/router'
import withGA from 'next-ga'
import Head from 'next/head'
// import { NextPage, NextPageContext } from 'next'; // : NextPage<{}>
import { IRootState } from '@/store/reducers/IRootState'
import withReduxStore from '@/hocs/with-redux-store'
import '@/css/layout.css'
import '@/css/link-as-rippled-btn.css'
import '@/css/rippled-btn.css'
import 'react-image-gallery/styles/css/image-gallery.css';
import { Toaster } from '@/components/Toaster'
import { ThemeProvider } from 'styled-components'
import { Theme } from '@/ui-kit'
import { AnimatePresence } from 'framer-motion'

const gaTrackingId = process.env.GA_TRACKING_ID || 'UA-xxxxxxxxx-x'

interface IProps {
  reduxStore: IRootState
  pageProps: any
}

class MyApp extends App<IProps> {
  static async getInitialProps({ Component, ctx }) {
    let pageProps: any = {}

    if (Component.getInitialProps) pageProps = await Component.getInitialProps(ctx)
    // This exposes the query to the user
    pageProps.query = ctx.query

    return { pageProps }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props

    return (
      <AnimatePresence exitBeforeEnter>
        <Head>
          <title>Pravosleva</title>
        </Head>
        <ThemeProvider theme={Theme}>
          <Provider store={reduxStore}>
            <Toaster />
            <Component {...pageProps} />
          </Provider>
        </ThemeProvider>
      </AnimatePresence>
    )
  }
}

export default withGA(gaTrackingId, Router)(withReduxStore(MyApp))
