const webpack = require('webpack');

module.exports = config => {
  // Add process.env.LINUX
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.LINUX': process.platform === 'linux'
    })
  );

  return config;
};
