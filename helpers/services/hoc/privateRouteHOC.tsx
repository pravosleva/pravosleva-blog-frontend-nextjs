import React, { Component } from 'react'
import ServerCookie from 'next-cookies'
import Router from 'next/router'
import { connect } from 'react-redux'
import { COOKIES } from '@/helpers/services/loginService'
import { AuthToken } from '@/helpers/services/AuthToken'
import { getMe } from '../restService'
import { userInfoActions } from '@/store/reducers/user-info'
import { ResponseLocal } from '@/utils/errors/api'
import { IUserInfo } from '@/helpers/services/IUserInfo'
import { NextPageContext } from 'next'

type TAuthProps = {
  auth: AuthToken
  userInfo: IUserInfo | null
  dispatch: Function
  t: Function
}

export function privateRouteHOC(WrappedComponent: any) {
  class App extends Component<TAuthProps> {
    static async getInitialProps(ctx: NextPageContext) {
      const token = ServerCookie(ctx)[COOKIES.authToken]
      const auth = new AuthToken(token)
      const userInfo = await getMe(auth.authorizationString).then((result: ResponseLocal.IResult) => {
        if (result.isOk) {
          return result.response
        }
        return null
      })
      const initialProps = { auth, userInfo }
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

    componentDidMount() {
      if (this.props.userInfo?.id) {
        this.props.dispatch(userInfoActions.setUser(this.props.userInfo))
      }
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

  return connect()(App)
}
