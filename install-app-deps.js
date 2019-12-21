// For Linux, dbus should be installed

const pkg = require('./package.json');
const exec = require('child_process').exec;

const dbusVer = pkg.optionalDependencies.dbus;

if (process.platform === 'Linux') {
  exec('npm install dbus@' + dbusVer);

  exec('electron-builder install-app-deps');
}
