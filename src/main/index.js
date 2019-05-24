// @flow strict

import { app, BrowserWindow } from 'electron';
import { globalAgent } from 'http';

let win = null;

const isDevelopment = process.env.NODE_ENV !== 'production';

function createWindow() {
  win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    width: 1280,
    height: 720,
    title: 'Music Player',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });

  win.setMenu(null);

  win.webContents.openDevTools();

  if (isDevelopment) {
    if (process.env.ELECTRON_WEBPACK_WDS_PORT == null) {
      throw 'Missing electron-webpack port';
    }

    win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    win.loadURL('file://' + __dirname + '/index.html');
  }

  global.windowID = win.id;

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
