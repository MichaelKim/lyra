/* eslint-disable @typescript-eslint/no-var-requires */
// For Linux, dbus should be installed

const { exec } = require('child_process');
const { optionalDependencies } = require('./package.json');

const dbusVer = optionalDependencies.dbus;

if (process.platform === 'Linux') {
  exec('npm install dbus@' + dbusVer);

  exec('electron-builder install-app-deps');
}
