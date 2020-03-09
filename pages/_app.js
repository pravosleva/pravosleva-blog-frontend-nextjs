import App from 'next/app';
import { Provider } from 'react-redux';
import Head from 'next/head';
// import url from 'url';

import withReduxStore from '../hocs/with-redux-store';


// let gaTrackingId = process.env.GA_TRACKING_ID || '';
// const isProduction = process.env.NODE_ENV === 'production';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // This exposes the query to the user
    pageProps.query = ctx.query;

    return { pageProps };
  }

  render () {
    const {
      Component,
      pageProps,
      reduxStore,
    } = this.props;

    return (
      <>
        <Head>
          <title>Pravosleva</title>

          {/* Global Site Tag (gtag.js) - Google Analytics
            isProduction && gaTrackingId && (
              <>
                <script dangerouslySetInnerHTML={{
                  __html: `
(function (w, d, s, l, i) {
w[l] = w[l] || []
w[l].push({
'gtm.start':
  new Date().getTime(), event: 'gtm.js'
})
var f = d.getElementsByTagName(s)[0],
j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''
j.async = true
j.src =
'https://www.googletagmanager.com/gtm.js?id=' + i + dl
f.parentNode.insertBefore(j, f)
})(window, document, 'script', 'dataLayer', '${gaTrackingId}')
                  `
                }} />

              </>
            )
          */}
        </Head>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </>
    );
  }
}

export default withReduxStore(MyApp);
