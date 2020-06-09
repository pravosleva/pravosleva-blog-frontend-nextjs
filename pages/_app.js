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
// From each link in article to new browser tab:
window.addEventListener('load', function() {
  const articleBody = document.querySelector('.article-body');

  if (!!articleBody) articleBody.addEventListener('click', function(e) {
    if (e.originalTarget.tagName === 'A') {
      e.preventDefault();
      const newLink = window.document.createElement('a');

      newLink.setAttribute('href', e.originalTarget.href);
      newLink.setAttribute('target', '_blank');
      newLink.click();
    }
  });
})

// Rippled button tap effect:
window.addEventListener('load', function() {
  const clickListenedSpace = document.querySelector('.universal-container');

  if (!clickListenedSpace) return;

  clickListenedSpace.addEventListener('click', function(e) {
    if (e.originalTarget.classList.contains('link-as-rippled-btn')) {
      const x = e.clientX - e.target.offsetLeft;
      const ripples = document.createElement('span');

      ripples.classList.add('ripples');
      ripples.style.left = x + 'px';
      ripples.style.top = '50%';
      e.originalTarget.appendChild(ripples);
      setTimeout(() => {
        ripples.remove();
      }, 1000);
    } else if (e.originalTarget.parentNode.classList.contains('link-as-rippled-btn')) {
      const x = e.clientX - e.originalTarget.parentNode.offsetLeft;
      const ripples = document.createElement('span');

      ripples.classList.add('ripples');
      ripples.style.left = x + 'px';
      ripples.style.top = '50%';
      e.originalTarget.parentNode.appendChild(ripples);
      setTimeout(() => {
        ripples.remove();
      }, 1000);
    }
  }, true)
})
`,
              /* ORIGINAL SAMPLE
  const rippledButtons = document.querySelectorAll('.link-as-rippled-btn');

  rippledButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      // e.preventDefault();
      console.log(e.clientX, e.target.offsetLeft)
      // const x = e.clientX - e.target.offsetLeft;
      // const y = e.clientY - e.target.offsetTop;
      const x = e.clientX - e.target.offsetLeft;
      const y = e.clientY;

      const ripples = document.createElement('span');
      ripples.classList.add('ripples');

      // ripples.style.left = x + 'px';
      // ripples.style.top = y + 'px';
      ripples.style.left = x + 'px';
      ripples.style.top = '50%';

      console.log(this)
      this.appendChild(ripples);
      console.log(this)

      setTimeout(() => {
        ripples.remove();
      }, 1000);
    })
  })
*/
            }}
          />
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
