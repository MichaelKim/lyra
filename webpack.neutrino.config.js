/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');

module.exports = config => {
  config.entry = './src/neutrino/index.js';
  config.output.path = path.resolve(__dirname, 'dist/neutrino');
  // TODO: eslint error when removing neutrino/lib
  config.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules|neutrino[\\/]lib/,
    use: [
      'eslint-loader',
      {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      }
    ]
  });

  return config;
};
