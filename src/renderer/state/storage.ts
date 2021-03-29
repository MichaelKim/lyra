// @flow strict

import type { StoreState } from '../types';
import { ipcRenderer } from 'electron';

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
  ipcRenderer.send('state-save', state);
  console.log('Stored state:', state);
}

export function clear() {
  ipcRenderer.send('state-clear');
}
