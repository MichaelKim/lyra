/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const { DefinePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = async (_, argv) => {
  const isDev = argv.mode !== 'production';
  console.log(
    `===================${
      isDev ? 'DEV' : 'PROD'
    } RENDERER========================`
  );

  const config = {
    entry: {
      renderer: path.resolve('./src/renderer/index.tsx')
    },
    output: {
      path: path.resolve('./dist/renderer'),
      filename: '[name].js',
      chunkFilename: '[name].bundle.js'
    },
    target: 'web',
    module: {
      rules: [
        {
          test: /\.tsx?$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              targets: {
                electron: '10'
              },
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
        'process.env.PRODUCTION': !isDev,
        'process.env.UPDEEP_MODE': JSON.stringify('dangerously_never_freeze')
      }),
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
        template: path.resolve('./src/index.html')
      }),
      new MiniCssExtractPlugin()
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    stats: {
      colors: true
    },
    node: {
      global: false
    },
    watchOptions: {
      ignored: /^(?!.*src\/(css|fonts|icons|renderer|index\.html)).*$/
    }
  };

  if (isDev) {
    config.mode = 'development';
    config.devtool = 'cheap-module-source-map';
    config.devServer = {
      static: path.resolve('./dist/renderer'),
      host: 'localhost',
      port: argv.port,
      hot: true
    };
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
      new CssoWebpackPlugin(),
      new BundleAnalyzerPlugin()
    );
  }

  return config;
};
