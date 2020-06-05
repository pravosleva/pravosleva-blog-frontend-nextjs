const withCSS = require("@zeit/next-css");
const webpack = require("webpack");

const fs = require("fs");
const dotenv = require("dotenv");
const isProduction = process.env.NODE_ENV === "production";
const envFileName = isProduction ? ".env.prod" : ".env.dev";
const env = dotenv.parse(fs.readFileSync(envFileName));

const nextConfig = {
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(["NODE_ENV"]));

    return config;
  },
  devIndicators: {
    autoPrerender: false,
  },
  env,
};

module.exports = withCSS(nextConfig);
