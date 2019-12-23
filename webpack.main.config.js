const webpack = require('webpack');
const os = require('os');

module.exports = config => {
  // Add process.env.LINUX
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.LINUX': process.platform === 'linux'
    })
  );

  // Only bundle matching ffmpeg executable
  config.externals.push(
    new RegExp(`^@ffmpeg-installer/(?!${os.platform()}-${os.arch()})`)
  );

  return config;
};
