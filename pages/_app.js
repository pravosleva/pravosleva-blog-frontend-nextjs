import App from 'next/app'
import { Provider } from 'react-redux'
import Head from 'next/head'
// import url from 'url';

import withReduxStore from '@/hocs/with-redux-store'
import '@/css/layout.css'
import '@/css/link-as-rippled-btn.css'
import '@/css/rippled-btn.css'
import { Toaster } from '@/components/Toaster'

// let gaTrackingId = process.env.GA_TRACKING_ID || '';
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
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="theme-color" content="#0162c8" />
          <title>Pravosleva</title>
          <script
            defer
            dangerouslySetInnerHTML={{
              __html: `
// 1. From each link in article to new browser tab:
function linkInNewTab (e) {
  if (e.originalTarget.tagName === 'A') {
    e.preventDefault()
    const newLink = window.document.createElement('a')

    newLink.setAttribute('href', e.originalTarget.href)
    newLink.setAttribute('target', '_blank')
    newLink.click()
  }
}

window.addEventListener('load', function(e) {
  const articleBody = document.querySelector('.article-body')

  if (!!articleBody) {
    articleBody.addEventListener('click', linkInNewTab)
  }
})
`,
            }}
          />
          <link href="/prismjs/themes/prism-okaidia.css" rel="stylesheet" />
          <script defer src="/prismjs/prism.js"></script>
          <script defer src="/prismjs/plugins/prism-autoloader.js"></script>
        </Head>
        <Provider store={reduxStore}>
          <Toaster />
          <Component {...pageProps} />
        </Provider>
      </>
    )
  }
}

export default withReduxStore(MyApp)
