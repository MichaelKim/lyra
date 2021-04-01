import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { join } from 'path';
import 'source-map-support/register';
import checkAccessibility from './accessibility';
import { loadMenuListener } from './context';
import { registerStorage } from './storage';
import { registerUtil } from './util';
import { registerYoutube } from './yt-util';

let win: BrowserWindow | null = null;

function installExtensions() {
  // import('electron-devtools-installer')
  //   .then(installExtension =>
  //     installExtension.default([
  //       installExtension.REACT_DEVELOPER_TOOLS,
  //       installExtension.REDUX_DEVTOOLS
  //     ])
  //   )
  //   .then(name => console.log(`Added Extension:  ${name}`))
  //   .catch(err => console.log('An error occurred: ', err));
}

function createWindow() {
  const options: BrowserWindowConstructorOptions = {
    minWidth: 800,
    minHeight: 600,
    width: 1280,
    height: 720,
    title: 'Lyra Music Player',
    backgroundColor: '#333',
    webPreferences: {
      preload: join(app.getAppPath(), 'preload.js'),
      contextIsolation: true
    }
  };

  if (process.env.LINUX) {
    options.icon = './static/icon.png';
  }

  win = new BrowserWindow(options);

  win.setMenu(null);

  if (!process.env.PRODUCTION) {
    if (process.env.ELECTRON_RENDERER_PORT == null) {
      throw 'Missing webpack port';
    }

    win.loadURL(`http://localhost:${process.env.ELECTRON_RENDERER_PORT}`);

    installExtensions();

    win.webContents.openDevTools();
  } else {
    win.loadURL('file://' + __dirname + '/index.html');
  }

  checkAccessibility();
  loadMenuListener();
  registerStorage();
  registerUtil();
  registerYoutube();
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
