// @flow strict
// State storage

import fs from 'fs';
import path from 'path';
import { ipcMain } from 'electron';
import storage from 'electron-json-storage';
import { initialState } from '../renderer/state/storage';

import type { StoreState } from '../renderer/types';

export function sendState(webContents: { send: (string, StoreState) => void }) {
  storage.get<StoreState>('state', (err, state: ?StoreState) => {
    if (err || state == null) {
      webContents.send('state-load', initialState);
    } else {
      webContents.send('state-load', state);
    }
  });
}

ipcMain.on('state-save', (event, state: StoreState) => {
  storage.set('state', state, err => {
    if (err) console.log(err);
  });
});

ipcMain.on('state-clear', () => {
  const storagePath = storage.getDataPath();
  fs.readdir(storagePath, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach(file => {
      fs.unlink(path.join(storagePath, file), err => {
        if (err) {
          throw err;
        }
      });
    });
  });
});

console.log(storage.getDataPath());
