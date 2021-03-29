// @flow strict

import { app, BrowserWindow } from 'electron';
import path from 'path';

import checkAccessibility from './accessibility';
import { sendState } from './storage';
import { loadMenuListener } from './context';

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
    // $FlowFixMe[prop-missing]
    options.icon = './static/icon.png';
  }

  win = new BrowserWindow(options);

  win.setMenu(null);

  if (!process.env.PRODUCTION) {
    if (process.env.ELECTRON_MAIN_PORT == null) {
      throw 'Missing webpack port';
    }

    // $FlowFixMe[incompatible-use]
    win.loadURL(`http://localhost:${process.env.ELECTRON_MAIN_PORT}`);

    installExtensions();

    // $FlowFixMe[incompatible-use]
    win.webContents.openDevTools();
  } else {
    // $FlowFixMe[incompatible-use]
    win.loadURL('file://' + __dirname + '/index.html');
  }

  checkAccessibility();
  require('./shortcuts');

  // $FlowFixMe[incompatible-use]
  win.webContents.on('did-finish-load', () => {
    // $FlowFixMe[incompatible-use]
    sendState(win.webContents);
    loadMenuListener();
  });

  // $FlowFixMe[incompatible-use]
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
