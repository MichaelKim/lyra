// State storage

import { ipcMain } from 'electron';
import storage from 'electron-json-storage';
import fs from 'fs';
import path from 'path';
import { initialState } from '../renderer/state/storage';
import { StoreState } from '../renderer/types';

export function registerStorage() {
  ipcMain.handle('state-load', () => {
    return new Promise<StoreState>(resolve => {
      storage.has('state', (err, hasKey) => {
        if (err || !hasKey) {
          resolve(initialState);
          return;
        }

        storage.get('state', (err2, obj) => {
          const state = obj as StoreState;
          if (err2 || state == null) {
            resolve(initialState);
          } else {
            resolve(state);
          }
        });
      });
    });
  });

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
}

console.log(storage.getDataPath());
