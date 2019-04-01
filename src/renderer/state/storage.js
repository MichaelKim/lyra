// @flow strict

import storage from 'electron-json-storage';

import type { StoreState } from '../types';

export const initialState: StoreState = {
  loaded: false,
  songs: {},
  playlists: {}
};

export function save(state: StoreState) {
  storage.set('state', state, err => {
    if (err) console.log(err);
    else console.log('Stored state:', state);
  });
}

console.log(storage.getDataPath());
