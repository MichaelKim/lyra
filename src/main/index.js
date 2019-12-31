// @flow strict

import { app, BrowserWindow } from 'electron';
import path from 'path';

import checkAccessibility from './accessibility';

let win = null;

function installExtensions() {
  const installExtension = require('electron-devtools-installer');

  installExtension
    .default([
      installExtension.REACT_DEVELOPER_TOOLS,
      installExtension.REDUX_DEVTOOLS
    ])
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));
}

function createWindow() {
  const options = {
    minWidth: 800,
    minHeight: 600,
    width: 1280,
    height: 720,
    title: 'Lyra Music Player',
    backgroundColor: '#333',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  };

  if (process.env.LINUX) {
    // $FlowFixMe
    options.icon = path.join(__static, 'icon.png');
  }

  win = new BrowserWindow(options);

  win.setMenu(null);

  if (!process.env.PRODUCTION) {
    if (process.env.ELECTRON_WEBPACK_WDS_PORT == null) {
      throw 'Missing electron-webpack port';
    }

    win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);

    installExtensions();

    win.webContents.openDevTools();
  } else {
    win.loadURL('file://' + __dirname + '/index.html');
  }

  checkAccessibility();
  require('./shortcuts');

  win.on('closed', () => {
    win = null;
  });
}

app.disableHardwareAcceleration();

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
