module.exports = config => {
  // Enable .jsx extensions
  config.resolve.extensions.push('.jsx');
  const idx = config.module.rules.findIndex(
    r => r.use.loader === 'babel-loader'
  );
  config.module.rules[idx].test = /\.jsx?$/;

  return config;
};
