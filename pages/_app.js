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
        {/* <Provider store={reduxStore}> */}
          <Component {...pageProps} />
        {/* </Provider> */}
      </>
    );
  }
}

// export default withReduxStore(MyApp);
export default MyApp;
