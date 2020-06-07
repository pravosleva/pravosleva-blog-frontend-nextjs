const dev = process.env.NODE_ENV === 'development'

// This is not production ready, (except with providers that ensure a secure host, like Now)
// For production consider the usage of environment variables and NODE_ENV
function getHost(req) {
  if (!req) return ''

  const { host } = req.headers

  if (host.startsWith('localhost')) {
    return `http://${host}`
  }
  // return `https://${host}`;
  return 'http://80.87.194.181'
}

export default getHost
