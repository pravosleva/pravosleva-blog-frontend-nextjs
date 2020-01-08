const withCSS = require('@zeit/next-css');
// const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');


const nextConfig = {
  webpack (config) {
    config.plugins.push(new webpack.EnvironmentPlugin(['NODE_ENV']));

    return config
  },
  devIndicators: {
    autoPrerender: false,
  },
};

module.exports = withCSS(nextConfig);
