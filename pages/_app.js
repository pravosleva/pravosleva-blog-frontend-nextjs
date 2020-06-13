import App from 'next/app'
import { Provider } from 'react-redux'
import Router from 'next/router'
import withGA from 'next-ga'

import withReduxStore from '@/hocs/with-redux-store'
import '@/css/layout.css'
import '@/css/link-as-rippled-btn.css'
import '@/css/rippled-btn.css'
import { Toaster } from '@/components/Toaster'

const gaTrackingId = process.env.GA_TRACKING_ID || 'UA-xxxxxxxxx-x'
// const isProduction = process.env.NODE_ENV === 'production';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) pageProps = await Component.getInitialProps(ctx)
    // This exposes the query to the user
    pageProps.query = ctx.query

    return { pageProps }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props

    return (
      <>
        <Provider store={reduxStore}>
          <Toaster />
          <Component {...pageProps} />
        </Provider>
      </>
    )
  }
}

export default withGA(gaTrackingId, Router)(withReduxStore(MyApp))
