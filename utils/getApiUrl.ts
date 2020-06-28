export const isDev = process.env.NODE_ENV === 'development'
export const isProd = !isDev

export const baseApiURL = isDev ? 'http://localhost:1337' : 'http://pravosleva.ru/api'
export const getApiUrl = () => process.env.REACT_APP_API_ENDPOINT || 'http://localhost:1337'
export const getSocketApiUrl = () => process.env.REACT_APP_SOCKET_ENDPOINT || 'http://localhost:1337'
export const getImageUrl = (url: string) =>
  isDev ? `${process.env.REACT_APP_API_ENDPOINT}${url}` : `${baseApiURL}${url}`
export const getBgSrc = (url: string) => (isDev ? `${process.env.REACT_APP_API_ENDPOINT}${url}` : `${baseApiURL}${url}`)
