import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import Router from 'next/router'

// import { gaPageView } from '../helpers/google-analytics';

const isProd = process.env.NODE_ENV === 'production'
const yandexCounterId = !!process.env.YANDEX_COUNTER_ID ? Number(process.env.YANDEX_COUNTER_ID) : null

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  componentDidMount() {
    // We want to do this code _once_ after the component has successfully
    // mounted in the browser only, so we use a special semiphore here.
    // https://github.com/zeit/next.js/issues/160
    if (!window || window.__NEXT_ROUTER_PAGEVIEW_REGISTERED__) return

    window.__NEXT_ROUTER_PAGEVIEW_REGISTERED__ = true
    let lastTrackedUrl = ''

    // NOTE: No corresponding `off` as we want this event listener to exist
    // for the entire lifecycle of the page
    // NOTE: This does _not_ fire on first page load. This is what we want
    // since GA already tracks a page view when the tag is first loaded.

    // WAY 1:
    Router.router.events.on('routeChangeComplete', (newUrl = document.location) => {
      if (newUrl === lastTrackedUrl || typeof window === 'undefined' || !window.gtag) return

      // Don't double track the same URL
      lastTrackedUrl = newUrl

      // Believe it or not, this triggers a new pageview event!
      // https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications

      // SHOULD BE UNCOMMENTED:
      // gaPageView(url.parse(newUrl).path);
    })

    // Or WAY 2:
    // Router.onRouteChangeComplete = url => gaPageView(url);
  }

  render() {
    return (
      <html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <title>Pravosleva</title>
          <meta name="theme-color" content="#0162c8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          {/*
          <link href="/static/prismjs/themes/prism-okaidia.min.css" rel="stylesheet" />
          */}
          <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500" rel="stylesheet" />
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.8.0/css/all.css"
            integrity="sha384-Mmxa0mLqhmOeaE8vgOSbKacftZcsNYDjQzuCOm6D02luYSzBG8vpaOykv9lFQ51Y"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          {/*
          <script defer src="/static/prismjs/prism.min.js"></script>
          <script defer src="/static/prismjs/plugins/prism-autoloader.min.js"></script>
          */}
          <script
            defer
            dangerouslySetInnerHTML={{
              __html: `
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
  if (!!articleBody) articleBody.addEventListener('click', linkInNewTab)
})
`,
            }}
          />
          {isProd && !!yandexCounterId && (
            <>
              <script
                type="text/javascript"
                defer
                dangerouslySetInnerHTML={{
                  __html: `
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${yandexCounterId}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true });
`,
                }}
              />
              <noscript>
                <div>
                  <img
                    src={`https://mc.yandex.ru/watch/${yandexCounterId}`}
                    style={{ position: 'absolute', left: '-9999px' }}
                    alt=""
                  />
                </div>
              </noscript>
            </>
          )}
        </body>
      </html>
    )
  }
}

export default MyDocument
