import Document, {
  Head,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Router from 'next/router';

// import { gaPageView } from '../helpers/google-analytics';


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

    // WAY 1:
    Router.router.events.on('routeChangeComplete', (newUrl = document.location) => {
      if (newUrl === lastTrackedUrl || typeof window === 'undefined' || !window.gtag) return;

      // Don't double track the same URL
      lastTrackedUrl = newUrl;

      // Believe it or not, this triggers a new pageview event!
      // https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications

      // SHOULD BE UNCOMMENTED:
      // gaPageView(url.parse(newUrl).path);
    });

    // Or WAY 2:
    // Router.onRouteChangeComplete = url => gaPageView(url);
  }

  render() {
    return (
      <html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
