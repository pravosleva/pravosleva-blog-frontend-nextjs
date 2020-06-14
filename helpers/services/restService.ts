import axios, { AxiosRequestConfig } from 'axios'

import { getApiUrl } from '@/utils/getApiUrl'
import { TLoginInputs } from '@/pages/auth/login'
import { AuthToken } from './AuthToken'
// import { catchAxiosError } from './error'
import { getNormalizedInputs } from '@/utils/strapi/getNormalizedInputs'

import { apiResponseErrorHandler, ResponseLocal } from '@/utils/errors/api'
import { httpRequestErrorHandler } from '@/utils/errors/http/axios'
import { axiosUniversalCatch } from '@/helpers/services/axiosUniversalCatch'

const apiUrl = getApiUrl()

export const postLogin = async (inputs: TLoginInputs): Promise<string> => {
  const data = new URLSearchParams(getNormalizedInputs(inputs))
  let result: ResponseLocal.IResultSuccess | ResponseLocal.IResultError | any

  try {
    result = await post('/auth/local', data)
      .then(httpRequestErrorHandler) // .then((res) => res.data)
      .then(apiResponseErrorHandler) // .then((data) => data)
      .then((data: any) => ({
        isOk: true,
        response: data,
        msg: data.user?.username || 'No data.user?.usrname',
      }))
      .catch(axiosUniversalCatch)
  } catch (err) {
    result = {
      isOk: false,
      msg: 'ASYNC ERR: Не удалось обработать ошибку',
    }
  }

  if (result.isOk) {
    if (result.response && result.response?.jwt) {
      const { jwt } = result.response

      await AuthToken.storeToken(jwt)
      return Promise.resolve(result.msg)
    }
    return Promise.reject('ERR: Не обнаружен токен в ответе!')
  }
  return Promise.reject(result.msg)
}

export const logout = async (): Promise<string> => {
  try {
    await AuthToken.removeToken()
    return Promise.resolve('Ok')
  } catch (err) {
    return Promise.reject('LOGOUT ERR: Не удалось обработать ошибку')
  }
}

// a base configuration we can extend from
const baseConfig: AxiosRequestConfig = {
  baseURL: apiUrl,
  // headers: {
  //   'Origin': 'http://localhost:1337',
  //   'Access-Control-Allow-Origin': '*',
  // },
}

export const post = async (
  url: string,
  data: URLSearchParams
): Promise<ResponseLocal.IResultSuccess | ResponseLocal.IResultError | any> => {
  try {
    return axios
      .post(url, data, baseConfig)
      .then(httpRequestErrorHandler) // .then((res) => res.data)
      .then(apiResponseErrorHandler) // .then((data) => data)
      .then((data: any) => ({
        isOk: true,
        response: data,
      }))
      .catch(axiosUniversalCatch)
  } catch (err) {
    throw new Error(err)
  }
}

export const get = async (
  url: string,
  config: AxiosRequestConfig = {}
): Promise<ResponseLocal.IResultSuccess | ResponseLocal.IResultError> => {
  const axiosConfig = {
    ...baseConfig,
    ...config,
  }
  return await axios
    .get(url, axiosConfig)
    .then(httpRequestErrorHandler) // .then((res) => res.data)
    .then(apiResponseErrorHandler) // .then((data) => data)
    .then((data: any) => ({
      isOk: true,
      response: data,
    }))
    .catch(axiosUniversalCatch)
}
