const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const webpack = require('webpack')
const path = require('path')

const fs = require('fs')
const dotenv = require('dotenv')
const isProduction = process.env.NODE_ENV === 'production'
const envFileName = isProduction ? '.env.prod' : '.env.dev'
const env = dotenv.parse(fs.readFileSync(envFileName))

const nextConfig = {
  webpack(config) {
    config.resolve.alias['@'] = `${path.resolve(__dirname)}/`
    config.plugins.push(new webpack.EnvironmentPlugin(['NODE_ENV']))

    return config
  },
  env,
}

module.exports = withSass(withCSS(nextConfig))
