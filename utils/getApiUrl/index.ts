// import { Theme } from '@/ui-kit'

export const isDev = process.env.NODE_ENV === 'development'
export const isProd = !isDev
const isLocalNGINXEnabled = process.env.LOCAL_NGINX_IS_ENABLED === '1'

export const baseApiURL = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:1337'
export const getApiUrl = () => process.env.REACT_APP_API_ENDPOINT || 'http://localhost:1337'
export const getSocketApiUrl = () => process.env.REACT_APP_SOCKET_ENDPOINT || 'http://localhost:1337'

// TODO: Use standart breakpoints...
// const { mediaQueries } = Theme
// const mapedMediaQueries = new Map()
// const mqsList = Object.keys(mediaQueries)
// for (let i = 0, max = mqsList.length; i < max; i++) {
//   mapedMediaQueries.set(mqsList[i], { min: Number(mediaQueries[mqsList[i]].min.replace('px', '')), max: Number(mediaQueries[mqsList[i]].max.replace('px', '')) })
// }
// const normalizedMediaQueries = Object.keys(mediaQueries).map((key) => ({
//   key: Number([mediaQueries[key].min.replace('px', '')), Number(mediaQueries[key].max.replace('px', ''))]
// }))
// const qArray = []
// Object.keys(mediaQueries).forEach((key) => {
//   qArray.push(Number(mediaQueries[key].min.replace('px', '')))
// })

// const getOptimizedStandart = (currentWidth: number) => {
//   if (!!currentWidth) {
//     switch (true) {
//       case currentWidth >= 0 && currentWidth <= 100: return 100
//       case currentWidth > 100 && currentWidth <= 900: return 800
//       case currentWidth > 900: return 900
//       default: return 100
//     }
//   }
//   return 100
// }
// const insert = (arr, index, newItem) => [
//   ...arr.slice(0, index),
//   newItem,
//   ...arr.slice(index),
// ]
export const getImageUrl = (url: string, getFromProd?: boolean) => {
  if (!url) return '/static/img/text-1.jpeg'

  if (isDev && isLocalNGINXEnabled) return `${process.env.REACT_APP_API_ENDPOINT}${url}`

  return getFromProd ? `http://pravosleva.ru/api${url}` : `${process.env.REACT_APP_API_ENDPOINT}${url}`
}
export const getBgSrc = (url: string, getFromProd?: boolean) => {
  if (!url) return '/static/img/text-1.jpeg'

  if (isDev && isLocalNGINXEnabled) return `${process.env.REACT_APP_API_ENDPOINT}${url}`

  return getFromProd ? `http://pravosleva.ru/api${url}` : `${process.env.REACT_APP_API_ENDPOINT}${url}`
}
