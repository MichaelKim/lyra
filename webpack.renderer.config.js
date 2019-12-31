const os = require('os');
const webpack = require('webpack');

module.exports = config => {
  // Enable .jsx extensions
  config.resolve.extensions.push('.jsx');
  const idx = config.module.rules.findIndex(
    r => r.use.loader === 'babel-loader'
  );
  config.module.rules[idx].test = /\.jsx?$/;

  // Only bundle matching ffmpeg executable
  config.externals.push(
    new RegExp(`^@ffmpeg-installer/(?!${os.platform()}-${os.arch()})`)
  );

  // Add process.env.PRODUCTION
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.PRODUCTION': config.mode === 'production'
    })
  );

  return config;
};
