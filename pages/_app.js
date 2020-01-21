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
          {/* meta tags in progress... */}
          <link rel="icon" href="/favicon.ico" />
          <title>Pravosleva</title>

          {/* ADDITIONAL */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link href='https://fonts.googleapis.com/css?family=Montserrat:400,500' rel='stylesheet' />
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.0/css/all.css" integrity="sha384-Mmxa0mLqhmOeaE8vgOSbKacftZcsNYDjQzuCOm6D02luYSzBG8vpaOykv9lFQ51Y" crossOrigin="anonymous" />

          {/* Global Site Tag (gtag.js) - Google Analytics
            isProduction && (
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
