const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = async (env, argv) => {
  const isDev = argv.mode !== 'production';
  console.log(
    `===================${isDev ? 'DEV' : 'PROD'} MAIN========================`
  );

  const config = {
    context: __dirname,
    entry: {
      main: path.resolve('./src/main/index.js')
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
          test: /\.js$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              targets: {
                electron: '10'
              },
              presets: ['@babel/preset-env', '@babel/preset-flow']
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
      new ESLintPlugin({
        files: './src/main/**/*.{js}'
      })
    ],
    stats: {
      colors: true
    },
    node: {
      __dirname: true
    }
  };

  if (isDev) {
    config.mode = 'development';
    config.devtool = 'eval-source-map';
    // config.devServer = {
    //   contentBase: path.resolve('./build'),
    //   host: 'localhost',
    //   port: '8080',
    //   hot: true,
    //   overlay: true
    // };
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
    config.plugins.push(new CleanWebpackPlugin());
  }

  return config;
};
