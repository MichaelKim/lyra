// @flow strict

import fs from 'fs';
import path from 'path';
import storage from 'electron-json-storage';

import type { StoreState } from '../types';

export const initialState: StoreState = {
  loaded: false,
  songs: {},
  playlists: {},
  volume: 100,
  sort: {
    column: 'TITLE',
    direction: false
  },
  shuffle: false,
  nextSong: null
};

export function save(state: StoreState) {
  storage.set('state', state, err => {
    if (err) console.log(err);
    else console.log('Stored state:', state);
  });
}

export function clear() {
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
}

console.log(storage.getDataPath());
