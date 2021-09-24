/* eslint-disable @typescript-eslint/no-var-requires */

const { DefinePlugin } = require('webpack');
const path = require('path');

module.exports = config => {
  const isDev = config.mode !== 'production';
  console.log(`===========NEUTRINO MAIN ${isDev ? 'DEV' : 'PROD'}===========`);

  config.entry = './src/neutrino/index.js';
  config.output.path = path.resolve('./dist/neutrino');
  config.module.rules[0].use.unshift('eslint-loader');
  config.plugins.push(
    new DefinePlugin({
      'process.env.PRODUCTION': JSON.stringify(!isDev)
    })
  );

  return config;
};
