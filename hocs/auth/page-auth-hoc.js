import { useEffect } from 'react'
import Router from 'next/router'
// import axios from 'axios';
// import { compose, lifecycle } from 'recompose';
import {
  // login,
  auth,
  // logout,
} from './fns'
import { makeCounter } from '@/lib/make-counter'
// import { useSelector, useDispatch } from 'react-redux';
// import { userInfoActions } from '@/store/reducer/user-info';

const hocRenderCounter = makeCounter()
// const isDev = process.env.NODE_ENV === 'development';
// const baseURL = isDev
//   ? 'http://localhost:1337'
//   : 'http://80.87.194.181';
// const api = axios.create({ baseURL });

export const withAuthSync = (WrappedComponent) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === 'logout') {
        console.log('logged out from storage!')
        Router.push('/login')
      }
    }

    useEffect(() => {
      hocRenderCounter.inc()
      console.log(`page-auth-hoc render counter: ${hocRenderCounter.get()}`)

      window.addEventListener('storage', syncLogout)

      return () => {
        window.removeEventListener('storage', syncLogout)
        window.localStorage.removeItem('logout')
      }
    }, [])

    return <WrappedComponent {...props} />
  }

  Wrapper.getInitialProps = async (ctx) => {
    const jwt = auth(ctx)

    const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))

    // TODO: REFACTORING
    // const usr = await api.get('/users/me', {
    //   validateStatus: s => s>= 200 && s < 500,
    //   headers: { Authorization: `Bearer ${jwt}` },
    // })
    //   .then(res => {
    //     if (res && res.status === 200) return res.data;
    //     throw res;
    //   })
    //   .catch(() => null);

    return { ...componentProps, jwt }
  }

  return Wrapper
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
