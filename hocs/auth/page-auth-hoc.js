import { useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
// import { useDispatch } from 'react-redux';
import { login, auth, logout } from './fns';
import { makeCounter } from '../../lib/make-counter';
// import { userInfoActions } from '../../store/reducer/user-info';


const hocRenderCounter = makeCounter();

export const withAuthSync = WrappedComponent => {
  const Wrapper = props => {
    const syncLogout = event => {
      if (event.key === 'logout') {
        console.log('logged out from storage!');
        Router.push('/login');
      }
    }

    useEffect(() => {
      hocRenderCounter.inc();
      console.log(`auth hoc render counter: ${hocRenderCounter.get()}`);

      window.addEventListener('storage', syncLogout);

      return () => {
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem('logout');
      }
    }, []);

    return <WrappedComponent {...props} />
  }

  Wrapper.getInitialProps = async ctx => {
    const jwt = auth(ctx);

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx))

    return { ...componentProps, jwt }
  }

  return Wrapper;
}

// const dev = process.env.NODE_ENV === 'development';
// const baseURL = dev
//   ? 'http://localhost:1337'
//   : 'http://80.87.194.181/api';
// const api = axios.create({ baseURL });
// async function fetchMe () {
//   const route = '/users/me';
//   const res = await api.get(route)
//     .then(res => res.data)
//     .catch(err => err);
//
//   if (res && res.id) {
//     return Promise.resolve(res);
//   } else {
//     return Promise.reject(res);
//   };
// }
