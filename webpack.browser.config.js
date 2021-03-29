// Webpack config for browser
// See: https://webpack.electron.build/extending-as-a-library

const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = async (env, argv) => {
  const isDev = argv.mode !== 'production';
  console.log(
    `===================${
      isDev ? 'DEV' : 'PROD'
    } BROWSER========================`
  );

  const config = {
    context: __dirname,
    entry: {
      main: path.resolve('./src/renderer/index.jsx')
    },
    output: {
      path: path.resolve('./dist/browser'),
      filename: '[name].js',
      chunkFilename: '[name].bundle.js'
    },
    target: 'web',
    module: {
      rules: [
        {
          test: /\.jsx?$/i,
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
                '@babel/preset-flow'
              ],
              plugins: ['@babel/plugin-proposal-class-properties']
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
          test: /\.svg$/,
          type: 'asset'
        },
        {
          test: /\.ttf$/i,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new DefinePlugin({
        'process.env.PRODUCTION': JSON.stringify(!isDev),
        'process.env.UPDEEP_MODE': JSON.stringify('dangerously_never_freeze')
      }),
      new ESLintPlugin({
        files: './src/renderer/**/*.{js}'
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: './static/icon.png'
      }),
      new MiniCssExtractPlugin()
    ],
    resolve: {
      extensions: ['.browser.js', '.browser.jsx', '.js', '.jsx']
    },
    stats: {
      colors: true
    }
  };

  if (isDev) {
    config.mode = 'development';
    config.devtool = 'eval-source-map';
    config.devServer = {
      contentBase: path.resolve('./dist/browser'),
      host: 'localhost',
      port: '9000',
      hot: true,
      overlay: true
    };
    config.plugins.push(
      new DefinePlugin({
        'process.env.LYRA_URL': JSON.stringify('http://localhost:5000'),
        'process.env.LYRA_USE_API': JSON.stringify(false)
      })
    );
  } else {
    config.mode = 'production';
    // Basic options, except ignore console statements
    config.optimization = {
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            compress: {
              drop_console: true
            }
          }
        })
      ]
    };
    config.plugins.push(
      new CleanWebpackPlugin(),
      new DefinePlugin({
        'process.env.LYRA_URL': JSON.stringify('https://lyra.michael.kim'),
        'process.env.LYRA_USE_API': JSON.stringify(true)
      })
    );
  }

  return config;
};
