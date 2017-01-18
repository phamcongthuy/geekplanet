/* eslint-disable */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let definePlugin;

if (process.env.NODE && ~process.env.NODE.indexOf('heroku')) {
  definePlugin = new webpack.DefinePlugin(require('./src/config/heroku.config.json'));
} else {
  definePlugin = new webpack.DefinePlugin(require('./src/config/sccloud.config.json'));
}

const config = {
  entry: {
    main: [
      './src/client/index.jsx',
    ],
    vendor: [
      'auth0-lock',
      'jwt-decode',
      'react',
      'react-dom',
      'react-hot-loader',
      'react-intl',
      'react-redux',
      'react-router',
      'react-tap-event-plugin',
      'redux',
    ]
  },

  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[hash].[name].js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              'es2015',
              {
                'modules': false
              }
            ],
            'react'
          ],
          plugins: [
            'transform-flow-strip-types',
            'transform-runtime',
            'transform-react-jsx',
            'transform-react-inline-elements',
            'transform-react-constant-elements',
            [
              'react-intl',
              {
                'messagesDir': './dist/messages',
                'enforceDescriptions': false
              }
            ]
          ],
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/client/index.html',
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/client/assets/',
        to: 'assets/',
      }
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
    definePlugin,
  ],
};


module.exports = config;