import React, { useEffect } from 'react'
import Router from 'next/router'
// import axios from 'axios';
import nextCookie from 'next-cookies'
import { getMe } from '../hocs/auth/fns'
import { useSelector, useDispatch } from 'react-redux'
import { userInfoActions } from '../store/reducer/user-info'

import Layout from '../components/layout'

const Profile = ({ usr = null }) => {
  // const { name, login, bio, avatarUrl } = props.data;
  const userInfoFromServer = useSelector((state) => state.userInfo.fromServer)

  // --- Set to Redux on client
  const dispatch = useDispatch()
  useEffect(() => {
    if (usr.id) dispatch(userInfoActions.setUser({ ...usr }))
  }, [usr.id])
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
      <div className="article-body" style={{ marginBottom: '40px', marginTop: '30px' }}>
        <pre>{JSON.stringify(usr, null, 2)}</pre>
      </div>
      <h2>From Redux store</h2>
      <ul>
        <li>
          DONE: Will be set after login:
          <br />
          <code>await login().then(usr => dispatch(actionCreator(usr)))</code>
        </li>
        <li>
          DONE: Then will be set to Redux by <code>useEffect</code>
        </li>
        <li>
          DONE: * <code>getMe(ctx)</code> should be called in <code>getInitialProps</code>
        </li>
        <li>TODO: * Should be refactored: Redux-saga?</li>
        <li>
          TODO: Should <code>/users/me</code> be moved to hoc?
        </li>
      </ul>
      <div className="article-body" style={{ marginBottom: '40px', marginTop: '30px' }}>
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
  )
}

// const isDev = process.env.NODE_ENV === 'development';
Profile.getInitialProps = async (ctx) => {
  const { jwt } = nextCookie(ctx)
  // const baseURL = isDev
  //   ? 'http://localhost:1337'
  //   : 'http://80.87.194.181';
  // const api = axios.create({ baseURL });

  const redirectOnError = () =>
    typeof window !== 'undefined' ? Router.push('/login') : ctx.res.writeHead(302, { Location: '/login' }).end()

  if (!jwt) {
    await redirectOnError()
    return {}
  }

  try {
    const res = await getMe(ctx)
      .then((usr) => usr)
      .catch((err) => err)

    if (res && res.id) return { usr: res }
    else {
      // https://github.com/developit/unfetch#caveats
      await redirectOnError()
      return
    }
  } catch (err) {
    // Like { message: 'CATCHED; 404; Not Found' }
    console.log(err)
    // Implementation or Network error
    await redirectOnError()
    return
  }
}

export default Profile
