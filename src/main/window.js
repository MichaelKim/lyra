// @flow strict

import { BrowserWindow } from 'electron';
import path from 'path';
import os from 'os';

type LocalOptions = {|
  +name: string
|};

// Creates a new renderer window
export function createRenderer(
  localOptions: LocalOptions,
  options: mixed = {}
) {
  const win = new BrowserWindow(options);
  win.setMenu(null);

  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (isDevelopment) {
    if (process.env.ELECTRON_WEBPACK_WDS_PORT == null) {
      throw 'Missing electron-webpack port';
    }

    win.loadURL(
      `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}#${
        localOptions.name
      }`
    );

    BrowserWindow.addDevToolsExtension(
      path.join(
        os.homedir(),
        '.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0'
      )
    );
    win.webContents.openDevTools();
  } else {
    win.loadURL('file://' + __dirname + '/index.html');
  }

  return win;
}
