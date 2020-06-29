export const isDev = process.env.NODE_ENV === 'development'
export const isProd = !isDev

export const baseApiURL = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:1337'
export const getApiUrl = () => process.env.REACT_APP_API_ENDPOINT || 'http://localhost:1337'
export const getSocketApiUrl = () => process.env.REACT_APP_SOCKET_ENDPOINT || 'http://localhost:1337'
export const getImageUrl = (url: string, getFromProd?: boolean) =>
  getFromProd ? `http://80.87.194.181/api${url}` : `${process.env.REACT_APP_API_ENDPOINT}${url}`
export const getBgSrc = (url: string, getFromProd?: boolean) =>
  !!url
    ? getFromProd
      ? `http://80.87.194.181/api${url}`
      : `${process.env.REACT_APP_API_ENDPOINT}${url}`
    : '/static/img/text-1.jpeg'
