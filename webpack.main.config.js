const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  entry: './src/main/index.js',
  output: {
    filename: 'main.js',
    chunkFilename: 'main.bundle.js',
    path: path.join(__dirname, 'dist/main'),
    libraryTarget: 'commonjs2'
  },
  target: 'electron-main',
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
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10 * 1024 * 1024 }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.LINUX': process.platform === 'linux'
    }),
    new webpack.DefinePlugin({
      __static: path.resolve(__dirname, 'static')
    }),
    new webpack.HotModuleReplacementPlugin({})
  ],

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
