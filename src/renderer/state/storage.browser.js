// @flow strict

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
  try {
    window.localStorage.setItem('state', JSON.stringify(state));
    console.log('Stored state:', state);
  } catch (err) {
    console.log(err);
  }
}

export function clear() {
  window.localStorage.removeItem('state');
}
