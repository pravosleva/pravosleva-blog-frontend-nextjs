import { useEffect } from 'react';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';
import axios from 'axios';


const api = axios.create({ baseURL: '/api' });

export const login = async ({ jwt }) => {
  if (jwt) {
    const user = await api.get('/profile', {
      headers: { 'Authorization': `Bearer ${jwt}` }
    })
      .then(res => {
        if (res.status === 200) return res.data;

        throw res;
      })
      .catch(err => err);

    cookie.set('jwt', jwt, { expires: 1 });
    Router.push('/profile');

    if (user) {
      return Promise.resolve(user);
    } else {
      return Promise.reject('user was not received in helpers/auth/index');
    }
  }
}

export const auth = ctx => {
  const { jwt } = nextCookie(ctx);

  // If there's no jwt, it means the user is not logged in.
  if (!jwt) {
    if (typeof window === 'undefined') {
      ctx.res.writeHead(302, { Location: '/login' });
      ctx.res.end();
    } else {
      Router.push('/login');
    }
  }

  return jwt
}

export const logout = () => {
  cookie.remove('jwt');
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now());
  Router.push('/login');
}

export const withAuthSync = WrappedComponent => {
  const Wrapper = props => {
    const syncLogout = event => {
      if (event.key === 'logout') {
        console.log('logged out from storage!');
        Router.push('/login');
      }
    }

    useEffect(() => {
      window.addEventListener('storage', syncLogout);

      return () => {
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem('logout');
      }
    }, [])

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
