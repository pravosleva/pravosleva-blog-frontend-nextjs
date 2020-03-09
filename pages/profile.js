import React, { useEffect } from 'react';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';

import Layout from '../components/layout';
import { withAuthSync } from '../hocs/auth';
import getHost from '../hocs/auth/get-host';
import { useSelector, useDispatch } from 'react-redux';
import { userInfoActions } from '../store/reducer/user-info';


const Profile = ({ usr = null }) => {
  // const { name, login, bio, avatarUrl } = props.data;
  const userInfoFromServer =  useSelector(state => state.userInfo.fromServer);

  // --- Set to Redux on client
  const dispatch = useDispatch();
  useEffect(() => {
    if (usr.id) dispatch(userInfoActions.setUser({ ...usr }));
  }, [usr.id]);
  // ---

  return (
    <Layout>
      {/*
      <img src={avatarUrl} alt="Avatar" />
      <h1>{name}</h1>
      <p className="lead">{login}</p>
      <p>{bio}</p>
      */}

      <h2>From getInitialProps</h2>
      <ul>
        <li>DONE: Was received by SSR for this page</li>
      </ul>
      <div
        className='article-body'
        style={{ marginBottom: '40px', marginTop: '30px' }}
      >
        <pre>{JSON.stringify(usr, null, 2)}</pre>
      </div>
      <h2>From Redux store</h2>
      <ul>
        <li>DONE: Will be set after login:<br /><code>await login().then(usr => dispatch(actionCreator(usr)))</code></li>
        <li>DONE: Then will be set to Redux by <code>useEffect</code></li>
        <li>TODO: Should be set after <code>/users/me</code></li>
      </ul>
      <div
        className='article-body'
        style={{ marginBottom: '40px', marginTop: '30px' }}
      >
        <pre>{JSON.stringify(userInfoFromServer, null, 2)}</pre>
      </div>

      <style jsx>{`
        img {
          max-width: 200px;
          border-radius: 0.5rem;
        }
        h1 {
          margin-bottom: 0;
        }
        .lead {
          margin-top: 0;
          font-size: 1.5rem;
          font-weight: 300;
          color: #666;
        }
        p {
          color: #6a737d;
        }
      `}</style>
    </Layout>
  );
}

Profile.getInitialProps = async ctx => {
  const { jwt } = nextCookie(ctx);
  const nextApiUrl = getHost(ctx.req) + '/api/profile';

  const redirectOnError = () =>
    typeof window !== 'undefined'
      ? Router.push('/login')
      : ctx.res.writeHead(302, { Location: '/login' }).end();

  try {
    const response = await fetch(nextApiUrl, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${jwt}` },
    });

    if (response.ok) {
      const usr = await response.json();

      return { usr };
    } else {
      // https://github.com/developit/unfetch#caveats
      return await redirectOnError();
    }
  } catch (error) {
    // Implementation or Network error
    return redirectOnError();
  }
}

export default withAuthSync(Profile);
