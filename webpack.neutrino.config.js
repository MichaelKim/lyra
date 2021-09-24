/* eslint-disable @typescript-eslint/no-var-requires */

const { DefinePlugin } = require('webpack');
const path = require('path');

module.exports = config => {
  const isDev = config.mode !== 'production';
  console.log(`===========NEUTRINO MAIN ${isDev ? 'DEV' : 'PROD'}===========`);

  config.entry = './src/neutrino/index.js';
  config.output.path = path.resolve('./dist/neutrino');
  // TODO: eslint error when removing neutrino/lib
  config.module.rules = [
    {
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
    }
  ];
  config.plugins.push(
    new DefinePlugin({
      'process.env.PRODUCTION': JSON.stringify(!isDev)
    })
  );

  return config;
};
