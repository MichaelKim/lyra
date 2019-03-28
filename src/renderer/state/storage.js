// @flow strict

import storage from 'electron-json-storage';

import type { StoreState } from '../types';

export const initialState: StoreState = {
  loaded: false,
  songs: []
};

export function save(state: StoreState) {
  storage.set('songs', state.songs, err => {
    if (err) console.log(err);
    else console.log('Stored songs:', state.songs);
  });
}

console.log(storage.getDataPath());
