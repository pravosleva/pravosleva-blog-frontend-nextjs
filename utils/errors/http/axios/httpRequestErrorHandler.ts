import { HttpRequestError } from '@/utils/errors/http/HttpRequestError'

export const httpRequestErrorHandler = (obj: any): any | HttpRequestError => {
  console.log(obj)
  if (obj.status === 200) {
    return obj.data
  } else {
    // console.log(obj)
    throw new HttpRequestError(obj.response?.status, obj.response?.statusText)
  }
}
