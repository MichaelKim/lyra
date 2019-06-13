// @flow strict

import { app, BrowserWindow } from 'electron';
import { globalAgent } from 'http';
import path from 'path';

import { createRenderer } from './window';

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

  win = createRenderer(
    {
      name: 'main'
    },
    options
  );

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
