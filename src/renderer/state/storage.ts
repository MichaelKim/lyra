import { StoreState } from '../types';

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
  window.state.save(state);
  console.log('Stored state:', state);
}

export function clear() {
  window.state.clear();
}
