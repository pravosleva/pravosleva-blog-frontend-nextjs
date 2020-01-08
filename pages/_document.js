import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Router from 'next/router';

// import { gaPageView } from '../helpers/google-analytics';


// let gaTrackingId = process.env.GA_TRACKING_ID || '';
const isProduction = process.env.NODE_ENV === 'production';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal();
    }
  }

  componentDidMount() {
    // We want to do this code _once_ after the component has successfully
    // mounted in the browser only, so we use a special semiphore here.
    // https://github.com/zeit/next.js/issues/160
    if (!window || window.__NEXT_ROUTER_PAGEVIEW_REGISTERED__) return;

    window.__NEXT_ROUTER_PAGEVIEW_REGISTERED__ = true;
    let lastTrackedUrl = '';

    // NOTE: No corresponding `off` as we want this event listener to exist
    // for the entire lifecycle of the page
    // NOTE: This does _not_ fire on first page load. This is what we want
    // since GA already tracks a page view when the tag is first loaded.

    Router.router.events.on('routeChangeComplete', (newUrl = document.location) => {
      if (newUrl === lastTrackedUrl || typeof window === 'undefined' || !window.gtag) return;

      // Don't double track the same URL
      lastTrackedUrl = newUrl;

      // 1.
      // Believe it or not, this triggers a new pageview event!
      // https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications
      // gaPageView(url.parse(newUrl).path);

      // 2. Scroll up
      // if (window) window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // Or this: Router.onRouteChangeComplete = url => gaPageView(url);
  }

  render() {
    return (
      <html>
        <Head>
          {/* meta tags in progress... */}
          <link rel="icon" href="/favicon.ico" />
          <title>Pravosleva</title>

          {/* ADDITIONAL */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.0/css/all.css" integrity="sha384-Mmxa0mLqhmOeaE8vgOSbKacftZcsNYDjQzuCOm6D02luYSzBG8vpaOykv9lFQ51Y" crossOrigin="anonymous" />
          <link href='https://fonts.googleapis.com/css?family=Montserrat:400,500' rel='stylesheet' />
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
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
