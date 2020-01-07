import App from 'next/app';
// import { Provider } from 'react-redux';
import Head from 'next/head';
import url from 'url';

// import withReduxStore from '../lib/with-redux-store';


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
      // reduxStore,
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
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.0/css/all.css" integrity="sha384-Mmxa0mLqhmOeaE8vgOSbKacftZcsNYDjQzuCOm6D02luYSzBG8vpaOykv9lFQ51Y" crossOrigin="anonymous" />
          <link href='https://fonts.googleapis.com/css?family=Montserrat:400,500' rel='stylesheet' />
        </Head>
        {/* <Provider store={reduxStore}> */}
          <Component {...pageProps} />
        {/* </Provider> */}
      </>
    );
  }
}

// export default withReduxStore(MyApp);
export default MyApp;
