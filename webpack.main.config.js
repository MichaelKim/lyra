const os = require('os');
const webpack = require('webpack');

module.exports = config => {
  // Add process.env.LINUX, process.env.PRODUCTION
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.LINUX': process.platform === 'linux',
      'process.env.PRODUCTION': config.mode === 'production'
    })
  );

  // Only bundle matching ffmpeg executable
  config.externals.push(
    new RegExp(`^@ffmpeg-installer/(?!${os.platform()}-${os.arch()})`)
  );

  return config;
};
