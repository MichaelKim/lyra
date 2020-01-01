// Webpack config for browser
// See: https://webpack.electron.build/extending-as-a-library

const renderer = require('electron-webpack/webpack.renderer.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = async (env, argv) => {
  // electron-webpack reads from process.env.NODE_ENV
  process.env.NODE_ENV = argv.mode;
  const config = await renderer(env, argv);

  config.externals = [];
  config.node = {};
  config.output.libraryTarget = 'var';
  config.output.path = path.join(__dirname, 'dist/browser');
  config.plugins[0] = new HtmlWebpackPlugin({
    template: './src/index.html',
    favicon: './static/icon.png'
  });
  if (argv.mode === 'production') {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.LYRA_URL': JSON.stringify('https://lyra.michael.kim'),
        'process.env.LYRA_USE_API': JSON.stringify(true),
        'process.env.BROWSER': JSON.stringify(true),
        'process.env.PRODUCTION': JSON.stringify(true)
      })
    );
  } else {
    config.devServer.port = 9000;
    config.plugins = config.plugins.slice(0, 4);
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.LYRA_URL': JSON.stringify('http://localhost:5000'),
        'process.env.LYRA_USE_API': JSON.stringify(false),
        'process.env.BROWSER': JSON.stringify(true),
        'process.env.PRODUCTION': JSON.stringify(false)
      })
    );
  }
  config.resolve.extensions.unshift('.browser.js');
  config.target = 'web';

  return config;
};
