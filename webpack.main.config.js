/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const os = require('os');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = async (_, argv) => {
  const isDev = argv.mode !== 'production';
  console.log(
    `===================${isDev ? 'DEV' : 'PROD'} MAIN========================`
  );

  const config = {
    entry: {
      main: path.resolve('./src/main/index.ts'),
      preload: path.resolve('./src/main/preload.ts')
    },
    output: {
      path: path.resolve('./dist/main'),
      filename: '[name].js',
      chunkFilename: '[name].bundle.js',
      library: {
        type: 'commonjs2'
      }
    },
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.ts$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              targets: {
                electron: '10'
              },
              presets: ['@babel/preset-env', '@babel/preset-typescript'],
              plugins: [
                [
                  '@babel/plugin-transform-typescript',
                  { allowDeclareFields: true }
                ]
              ]
            }
          }
        }
      ]
    },
    plugins: [
      new DefinePlugin({
        'process.env.LINUX': process.platform === 'linux',
        'process.env.PRODUCTION': !isDev,
        'process.env.ELECTRON_MAIN_PORT': 8080
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
          files: './src/main/**/*.ts'
        }
      })
    ],
    resolve: {
      extensions: ['.ts', '.js']
    },
    stats: {
      colors: true
    },
    node: {
      __dirname: true
    },
    externals: [
      '@ffmpeg-installer/ffmpeg',
      'fluent-ffmpeg',
      'dbus',
      new RegExp(`^@ffmpeg-installer/(?!${os.platform()}-${os.arch()})`)
    ],
    watchOptions: {
      ignored: /^(?!.*src\/main).*$/
    }
  };

  if (isDev) {
    config.mode = 'development';
    config.devtool = 'eval-source-map';
    config.devServer = {
      contentBase: path.resolve('./dist/main'),
      hot: true,
      overlay: true,
      compress: true
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
    config.plugins?.push(new CleanWebpackPlugin());
  }

  return config;
};
