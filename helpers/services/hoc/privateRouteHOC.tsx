import React, { Component } from 'react'
import ServerCookie from 'next-cookies'
import Router from 'next/router'

import { COOKIES } from '@/helpers/services/loginService'
import { AuthToken } from '@/helpers/services/AuthToken'

export type TAuthProps = {
  auth: AuthToken
}

export function privateRouteHOC(WrappedComponent: any) {
  return class extends Component<TAuthProps> {
    static async getInitialProps(ctx) {
      const token = ServerCookie(ctx)[COOKIES.authToken]
      const auth = new AuthToken(token)
      const initialProps = { auth }
      if (auth.isExpired) {
        if (!!process.browser) {
          Router.push('/auth/login?redirected=true')
        } else {
          ctx.res.writeHead(302, {
            Location: '/auth/login?redirected=true',
          })
          ctx.res.end()
        }
      }
      if (WrappedComponent.getInitialProps) return WrappedComponent.getInitialProps(initialProps)
      return initialProps
    }

    get auth() {
      // the server pass to the client serializes the token
      // so we have to reinitialize the authToken class
      //
      // @see https://github.com/zeit/next.js/issues/3536
      return new AuthToken(this.props.auth.token)
    }

    render() {
      return <WrappedComponent auth={this.auth} {...this.props} />
    }
  }
}
