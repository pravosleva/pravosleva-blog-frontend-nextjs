import Router from 'next/router';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';
import axios from 'axios';

// import { makeCounter } from '../../lib/make-counter';


const isDev = process.env.NODE_ENV === 'development';
const baseURL = isDev
  ? 'http://localhost:1337'
  : 'http://80.87.194.181/api';
const api = axios.create({ baseURL });

export const login = async ({ jwt }) => {
  if (jwt) {
    const user = await api.get('/users/me', {
      headers: { 'Authorization': `Bearer ${jwt}` }
    })
      .then(res => {
        if (res.status === 200) return res.data;

        throw res;
      })
      .catch(err => err);

    cookie.set('jwt', jwt, { expires: 1 });
    Router.push('/profile');

    if (user) return Promise.resolve(user)
    else return Promise.reject('user was not received in helpers/auth/index');
  } else {
    return Promise.reject('COULD NOT BE LOGGED BY JWT! helpers/auth/index');
  }
}

export const auth = async ctx => {
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

  return jwt;
}

export const logout = () => {
  cookie.remove('jwt');
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now());
  Router.push('/');
}

export const getMe = async ctx => {
  const { jwt } = nextCookie(ctx);

  try {
    const res = await api.get('/users/me', {
      validateStatus: s => s>= 200 && s < 500,
      headers: { Authorization: `Bearer ${jwt}` },
    })
      .then(res => {
        if (res && res.status === 200) return res.data;
        throw res;
      })
      .catch(async err => {
        let obj = { message: 'CATCHED #1' };
        const resFields = ['status', 'statusText'];

        await resFields.forEach((f, i) => {
          if (err.response && err.response[f]) {
            if (i === 0) obj.message += `: ${err.response[f]}`
            else obj.message += `; ${err.response[f]}`;
          }
        });

        throw obj;
      });

    if (res) return Promise.resolve(res)
    else return Promise.reject({ message: 'getMe() FUCKUP #2' });
  } catch (err) { // Like { message: 'CATCHED; 404; Not Found' }
    return Promise.reject(err);
  }
};
