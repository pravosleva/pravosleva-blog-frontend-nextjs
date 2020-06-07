import { ApiResponseError } from './ApiResponseError'

export const apiResponseErrorHandler = (res: any): any | ApiResponseError => {
  if (!!res) {
    // Or like Uremont: res.success === 1
    return res
  } else {
    throw new ApiResponseError(res?.errors)
  }
}
