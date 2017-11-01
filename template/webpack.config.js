const path = require('path')
var webpack = require('webpack')

const genConfig = () => {
  let defaultConfig = {
    baseUrl: 'https://resources.library.nd.edu/frame',
    contentfulAPI: 'https://bj5rh8poa7.execute-api.us-east-1.amazonaws.com/dev',
    version: 'dev',
  }

  let config = {
    baseUrl: process.env.BASE_URL ? process.env.BASE_URL : defaultConfig.baseUrl,
    contentfulAPI: process.env.CONTENTFUL_API ? process.env.CONTENTFUL_API : defaultConfig.contentfulAPI,
    version: process.env.VERSION ? process.env.VERSION : defaultConfig.version,
  }

  return { __APP_CONFIG__: JSON.stringify(config) }
}

module.exports = {
  entry: "./code.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "code.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
        ],
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'images/[name].[ext]'
        }
      },
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        // include: paths.appSrc,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              url: false,
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin(genConfig()),
  ]
}