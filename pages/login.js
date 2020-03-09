import React, { useState } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import nextCookie from 'next-cookies';

import Layout from '../components/layout';
import { login, getMe } from '../hocs/auth/fns';
import { userInfoActions } from '../store/reducer/user-info';


const isDev = process.env.NODE_ENV === 'development';
const baseURL = isDev
  ? 'http://localhost:1337'
  : 'http://80.87.194.181/api';
const api = axios.create({ baseURL });
const Login = () => {
  const [userData, setUserData] = useState({ username: '', password: '', error: '' });
  const dispatch = useDispatch();

  const handleSubmit = async event => {
    event.preventDefault();
    setUserData(Object.assign({}, userData, { error: '' }));

    const username = userData.username;
    const password = userData.password;

    if (!username || !password) {
      setUserData(Object.assign({}, userData, { error: 'Please check your data.' }));
      return;
    };

    try {
      const response = await api.post(
        '/auth/local',
        { identifier: username, password },
        { validateStatus: status => status >= 200 && status < 500 },
      )
        .then(async res => {
          if (res.status === 200 && res.data) {
            const json = await res.data;
            const { jwt } = json;
    
            dispatch(userInfoActions.fillDelta({ isLoading: true, isLoadedSuccessfully: false }));
            await login({ jwt })
              .then(user => dispatch(userInfoActions.fillDelta({
                isLoading: false,
                fromServer: user,
                isLoadedSuccessfully: true,
              })))
              .catch(err => {
                dispatch(userInfoActions.fillDelta({
                  isLoading: false,
                  fromServer: err,
                  isLoadedSuccessfully: false,
                }));
              });
          } else {
            console.log('Login failed.')
            // https://github.com/developit/unfetch#caveats
            let error = new Error(response.statusText);
    
            error.response = response;
            throw error;
          }
        });
      
    } catch (error) {
      console.error(
        'You have an error in your code or there are Network issues.',
        error
      )

      const { response } = error;

      setUserData(
        Object.assign({}, userData, {
          error: response ? response.statusText : error.message,
          password: '',
        }),
      );
    }
  }

  return (
    <Layout>
      <div className="login">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>

          <input
            className='standart'
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={event =>
              setUserData(
                Object.assign({}, userData, { username: event.target.value, error: '' })
              )
            }
          />

          <label htmlFor="password">Password</label>

          <input
            className='standart'
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={event =>
              setUserData(
                Object.assign({}, userData, { password: event.target.value, error: '' })
              )
            }
          />

          <button className='standart' type="submit">Login</button>

          {userData.error && <p className="error">Error: {userData.error}</p>}
        </form>
      </div>
      <style jsx>{`
        .login {
          max-width: 340px;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        form {
          display: flex;
          flex-flow: column;
        }
        label {
          font-weight: 600;
        }
        input {
          padding: 8px;
          margin: 0.3rem 0 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .error {
          margin: 0.5rem 0 0;
          color: brown;
        }
      `}</style>
    </Layout>
  );
}

Login.getInitialProps = async ctx => {
  const redirectIfLogged = () =>
    typeof window !== 'undefined'
      ? Router.push('/profile')
      : ctx.res.writeHead(302, { Location: '/profile' }).end();

  try {
    const res = await getMe(ctx)
      .then(res => res)
      .catch(err => err);

    if (res && res.id) {
      redirectIfLogged();
      return {};
    } else {
      throw res;
    }
  } catch (err) { // Like { message: 'CATCHED: 404; Not Found' }
    console.log(err);
    return {};
  }
}

export default Login;
