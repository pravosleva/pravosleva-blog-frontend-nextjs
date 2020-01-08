const withCSS = require('@zeit/next-css');
const { parsed: localEnv } = require('dotenv').config();


const nextConfig = {
  webpack (config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv));

    return config
  },
  devIndicators: {
    autoPrerender: false,
  },
};

module.exports = withCSS(nextConfig);
