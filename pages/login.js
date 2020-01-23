import React, { useState } from 'react';
import fetch from 'isomorphic-unfetch';
import { useDispatch } from 'react-redux';

import Layout from '../components/layout';
import { login } from '../hocs/auth/fns';
import { userInfoActions } from '../store/reducer/user-info';


const Login = () => {
  const [userData, setUserData] = useState({ username: '', password: '', error: '' });
  const dispatch = useDispatch();

  const handleSubmit = async event => {
    event.preventDefault();
    setUserData(Object.assign({}, userData, { error: '' }));

    const username = userData.username;
    const password = userData.password;
    const nextApiUrl = '/api/login';

    if (!username || !password) {
      setUserData(Object.assign({}, userData, { error: 'Please check your data.' }));
      return;
    };

    try {
      const response = await fetch(nextApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.status === 200) {
        const json = await response.json()
        const { jwt } = json;

        dispatch(userInfoActions.fillDelta({ isLoading: true, isLoadedSuccessfully: false }));
        await login({ jwt })
          .then(user => {
            dispatch(userInfoActions.fillDelta({ isLoading: false, fromServer: user, isLoadedSuccessfully: true }));
          })
          .catch(err => {
            dispatch(userInfoActions.fillDelta({ isLoading: false, fromServer: err, isLoadedSuccessfully: false }));
            console.log(err);
          });
      } else {
        console.log('Login failed.')
        // https://github.com/developit/unfetch#caveats
        let error = new Error(response.statusText);

        error.response = response;
        throw error;
      }
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

export default Login;
