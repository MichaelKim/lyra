const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  entry: './src/renderer/index.jsx',
  output: {
    filename: 'renderer.js',
    chunkFilename: 'renderer.bundle.js',
    path: path.join(__dirname, 'dist/renderer'),
    libraryTarget: 'commonjs2'
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: '>1%, not ie 11, not op_mini all'
                }
              ],
              '@babel/preset-flow',
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-nullish-coalescing-operator',
              '@babel/plugin-proposal-optional-chaining'
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },

      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      },
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
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Lyra Music Player',
      template: './src/index.html',
      chunks: ['renderer']
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new webpack.DefinePlugin({
      'process.env.FLUENTFFMPEG_COV': false
    }),
    new webpack.DefinePlugin({
      __static: path.join(__dirname, 'static')
    }),
    new webpack.HotModuleReplacementPlugin({})
  ],
  devServer: {
    contentBase: [path.join(__dirname, 'dist/renderer')],
    host: 'localhost',
    port: '9080',
    hot: true,
    overlay: true
  },

  context: __dirname,
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  stats: {
    colors: true
  },
  optimization: {
    noEmitOnErrors: true
  },
  externals: [
    '@ffmpeg-installer/ffmpeg',
    'electron-json-storage',
    'fluent-ffmpeg',
    'googleapis',
    'source-map-support',
    'updeep',
    'ytdl-core',
    'ytsr'
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.mode = 'production';
    config.node = {
      __dirname: false
    };
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
  } else {
    config.mode = 'development';
    config.devtool = 'eval-source-map';
    config.node = {
      __dirname: true
    };
  }

  return config;
};
