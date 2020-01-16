const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = config => {
  const production = config.mode === 'production';
  const LYRA_URL = production
    ? 'https://lyra.michael.kim'
    : 'http://localhost:5000';

  config.output.path = path.join(__dirname, 'dist/neutrino-renderer');
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.LYRA_URL': JSON.stringify(LYRA_URL),
      'process.env.LYRA_USE_API': JSON.stringify(production)
    })
  );
  config.resolve.extensions.unshift(
    '.neutrino.js',
    '.neutrino.jsx',
    '.browser.js',
    '.browser.jsx'
  );
  config.module.rules.push(
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    },
    { test: /\.css$/, use: [{ loader: MiniCssExtractPlugin.loader }] },
    {
      test: /\.ttf$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      ]
    },
    {
      test: /\.svg$/,
      use: ['url-loader']
    },
    {
      test: /\.jsx?$/,
      // TODO: eslint error when removing neutrino/lib
      exclude: /node_modules|neutrino[\\/]lib/,
      use: [
        'eslint-loader',
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-flow',
              [
                '@babel/preset-env',
                {
                  targets: '>1%, not ie 11, not op_mini all'
                }
              ]
            ],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      ]
    }
  );

  return config;
};
