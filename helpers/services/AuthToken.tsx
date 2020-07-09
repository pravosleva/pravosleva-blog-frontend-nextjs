import jwtDecode from 'jwt-decode'
// import Router from 'next/router'
import Cookie from 'js-cookie'
import { COOKIES } from '@/helpers/services/loginService'

const authCookieExpiresDays = process.env.REACT_APP_AUTH_COOKIE_EXPIRES_IN_DAYS
  ? Number(process.env.REACT_APP_AUTH_COOKIE_EXPIRES_IN_DAYS)
  : 1

export type DecodedToken = {
  readonly email: string
  readonly exp: number
}

export class AuthToken {
  readonly decodedToken: DecodedToken

  constructor(readonly token?: string) {
    // we are going to default to an expired decodedToken
    this.decodedToken = { email: '', exp: 0 }

    // then try and decode the jwt using jwt-decode
    try {
      if (token) this.decodedToken = jwtDecode(token)
    } catch (e) {}
  }

  get authorizationString() {
    return `Bearer ${this.token}`
  }

  get expiresAt(): Date {
    return new Date(this.decodedToken.exp * 1000)
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt
  }

  get isValid(): boolean {
    return !this.isExpired
  }

  static async storeToken(token: string) {
    Cookie.set(COOKIES.authToken, token, { expires: authCookieExpiresDays })
    // await Router.push('/secret-page')
  }

  static async removeToken() {
    Cookie.remove(COOKIES.authToken)
    // await Router.push('/auth/login')
  }
}
