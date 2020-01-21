import React from 'react';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';
import Layout from '../components/layout';
import { withAuthSync } from '../helpers/auth';
import getHost from '../helpers/auth/get-host';


const Profile = props => {
  // const { name, login, bio, avatarUrl } = props.data;

  return (
    <Layout>
      {/*
      <img src={avatarUrl} alt="Avatar" />
      <h1>{name}</h1>
      <p className="lead">{login}</p>
      <p>{bio}</p>
      */}

      <h1>User</h1>
      <div
        className='article-body'
        style={{ marginBottom: '40px', marginTop: '30px' }}
      >
        <pre>{JSON.stringify(props, null, 2)}</pre>
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
  const apiUrl = getHost(ctx.req) + '/api/profile';

  const redirectOnError = () =>
    typeof window !== 'undefined'
      ? Router.push('/login')
      : ctx.res.writeHead(302, { Location: '/login' }).end();

  try {
    const response = await fetch(apiUrl, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (response.ok) {
      const user = await response.json();

      console.table({ ...user });

      return { ...user };
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
