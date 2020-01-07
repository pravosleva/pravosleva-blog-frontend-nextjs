const withCSS = require('@zeit/next-css');


const nextConfig = {
  webpack (config) {
    return config
  },
  devIndicators: {
    autoPrerender: false,
  },
};

module.exports = withCSS(nextConfig);
