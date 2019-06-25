// @flow strict

import { app, BrowserWindow } from 'electron';
import { globalAgent } from 'http';
import path from 'path';
import os from 'os';

import checkAccessibility from './accessibility';

let win = null;

const isDevelopment = process.env.NODE_ENV !== 'production';

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

  if (process.platform === 'linux') {
    // $FlowFixMe
    options.icon = path.join(__static, 'icon.png');
  }

  win = new BrowserWindow(options);

  win.setMenu(null);

  if (isDevelopment) {
    if (process.env.ELECTRON_WEBPACK_WDS_PORT == null) {
      throw 'Missing electron-webpack port';
    }

    win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);

    // BrowserWindow.addDevToolsExtension(
    //   path.join(
    //     os.homedir(),
    //     '.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0'
    //   )
    // );
    win.webContents.openDevTools();
  } else {
    win.loadURL('file://' + __dirname + '/index.html');
  }

  global.windowID = win.id;

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
