import { NetworkError } from '@/utils/errors/network'
import { HttpError } from '@/utils/errors/http'
import { ApiError, ResponseLocal } from '@/utils/errors/api'

export const universalFetchCatch = (err: any): ResponseLocal.IResultSuccess | ResponseLocal.IResultError => {
  switch (true) {
    case err instanceof NetworkError:
    case err instanceof HttpError:
    case err instanceof ApiError:
      return {
        isOk: false,
        msg: err.getErrorMsg(),
      }
    case err instanceof TypeError: // CORS?
      return {
        isOk: false,
        msg: err.message,
      }
    default:
      return {
        isOk: false,
        msg: `Request Error (${err.constructor.name}): Не удалось обработать ошибку`,
      }
  }
}
