import { HttpRequestError } from '@/utils/errors/http'
import { ApiResponseError, ResponseLocal } from '@/utils/errors/api'

export const axiosUniversalCatch = (err: {
  response: { request: { status: any; statusText: any } }
  request: any
  getErrorMsg: () => any
  message: any
}): ResponseLocal.IResultSuccess | ResponseLocal.IResultError => {
  if (err.response) {
    return {
      isOk: false,
      msg: `ERR ${err.response.request.status}: ${err.response.request.statusText}`,
    }
  } else if (err.request) {
    return {
      isOk: false,
      msg: 'ERR: Client never received a response, or request never left',
    }
  } else {
    switch (true) {
      // NOTE 2
      // Доп. обрабочики (помимо apiResponseErrorHandler) будут нужны,
      // если настройки options будут позволять провалиться дальше: axios по умолчанию все перехватит сам
      // (см. обработку выше)
      // case err instanceof NetworkError:
      case err instanceof HttpRequestError:
      case err instanceof ApiResponseError:
        // case Object.getPrototypeOf(err).name === 'Error':
        return {
          isOk: false,
          msg: err.getErrorMsg(),
        }
      case err instanceof TypeError:
        // case Object.getPrototypeOf(err).name === 'Error':
        return {
          isOk: false,
          msg: err.message,
        }
      default:
        return {
          isOk: false,
          msg: 'AXIOS ERR: Не удалось обработать ошибку',
        }
    }
  }
}
