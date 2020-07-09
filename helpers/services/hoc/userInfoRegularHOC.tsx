import React, { Component } from 'react'
import { connect } from 'react-redux'
import { COOKIES } from '@/helpers/services/loginService'
import { AuthToken } from '@/helpers/services/AuthToken'
import { getMe } from '../restService'
import { userInfoActions } from '@/store/reducers/user-info'
import { ResponseLocal } from '@/utils/errors/api'
import { IUserInfo } from '@/helpers/services/IUserInfo'
import Cookie from 'js-cookie'

type TAuthProps = {
  auth: AuthToken
  userInfo: IUserInfo | null
  dispatch: Function
  t: Function
}

export function userInfoRegularHOC(WrappedComponent: any) {
  class App extends Component<TAuthProps> {
    componentDidMount() {
      const auth = new AuthToken(Cookie.get(COOKIES.authToken))

      Promise.all([
        getMe(auth.authorizationString)
          .then((result: ResponseLocal.IResult) => {
            if (result.isOk) {
              return result.response
            }
            return null
          })
          .then((res: IUserInfo) => {
            if (!!res?.id) this.props.dispatch(userInfoActions.setUser(res))
          }),
      ])
    }

    get auth() {
      // the server pass to the client serializes the token
      // so we have to reinitialize the authToken class
      //
      // @see https://github.com/zeit/next.js/issues/3536
      return new AuthToken(Cookie.get(COOKIES.authToken))
    }

    render() {
      return <WrappedComponent auth={this.auth} {...this.props} />
    }
  }

  return connect()(App)
}
