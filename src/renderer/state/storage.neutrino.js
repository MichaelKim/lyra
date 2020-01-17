// @flow strict

import fs from 'fs';

import type { StoreState } from '../types';

export const initialState: StoreState = {
  loaded: false,
  songs: {},
  playlists: {},
  volume: {
    amount: 1,
    muted: false
  },
  sort: {
    column: 'TITLE',
    direction: false
  },
  shuffle: false,
  queue: {
    prev: [],
    curr: null,
    next: [],
    cache: {}
  },
  history: [],
  dlQueue: [],
  dlProgress: 0
};

export function save(state: StoreState) {
  fs.writeFile('state.json', JSON.stringify(state), err => {
    if (err) console.log(err);
    else console.log('Stored state:', state);
  });
}

export function clear() {
  fs.writeFile('state.json', JSON.stringify(initialState), err => {
    if (err) console.log(err);
    else console.log('Cleared state');
  });
}
