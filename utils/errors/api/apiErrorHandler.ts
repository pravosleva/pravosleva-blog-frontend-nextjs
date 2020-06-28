import { ApiError } from './ApiError'

export const apiErrorHandler = (res: any): any | ApiError => {
  if (!!res) {
    // Or like Uremont: res.success === 1
    return res
  } else {
    throw new ApiError(res?.errors)
  }
}
