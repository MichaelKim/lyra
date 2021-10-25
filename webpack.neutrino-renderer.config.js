/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const { DefinePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = config => {
  const isDev = config.mode !== 'production';
  console.log(
    `==========NEUTRINO RENDERER ${isDev ? 'DEV' : 'PROD'}==========`
  );

  const LYRA_URL = isDev ? 'http://localhost:5000' : 'https://lyra.michael.kim';

  config.entry = './src/renderer/index.tsx';
  config.output.path = path.resolve('./dist/neutrino-renderer');
  config.module = {
    rules: [
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            targets: '> 1%, not ie 11',
            presets: [
              '@babel/preset-env',
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic'
                }
              ],
              '@babel/preset-typescript'
            ],
            plugins: [
              [
                '@babel/plugin-transform-typescript',
                { allowDeclareFields: true }
              ]
            ]
          }
        }
      },
      {
        test: /\.scss$/i,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isDev
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isDev
            }
          }
        ]
      },
      {
        test: /\.svg$/i,
        type: 'asset'
      },
      {
        test: /\.ttf$/i,
        type: 'asset/resource'
      }
    ]
  };
  config.plugins = [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true
        },
        mode: 'write-references'
      },
      eslint: {
        files: './src/renderer/**/*.{ts,tsx}'
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './static/icon.png'
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: isDev ? '[id].css' : '[id].[contenthash].css'
    }),
    new DefinePlugin({
      'process.env.PRODUCTION': JSON.stringify(!isDev),
      'process.env.LYRA_URL': JSON.stringify(LYRA_URL),
      'process.env.LYRA_USE_API': JSON.stringify(!isDev)
    })
  ];
  config.resolve.extensions = [
    '.neutrino.ts',
    '.neutrino.tsx',
    '.browser.ts',
    '.browser.tsx',
    '.ts',
    '.tsx',
    '.js'
  ];

  if (!isDev) {
    config.plugins.push(new CssoWebpackPlugin(), new BundleAnalyzerPlugin());
  }

  return config;
};
