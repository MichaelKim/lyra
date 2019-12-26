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
  dlQueue: [],
  dlProgress: 0
};

export function save(state: StoreState) {
  void state;
  // storage.set('state', state, err => {
  //   if (err) console.log(err);
  //   else console.log('Stored state:', state);
  // });
}

export function clear() {
  // const storagePath = storage.getDataPath();
  // fs.readdir(storagePath, (err, files) => {
  //   if (err) {
  //     throw err;
  //   }
  //   files.forEach(file => {
  //     fs.unlink(path.join(storagePath, file), err => {
  //       if (err) {
  //         throw err;
  //       }
  //     });
  //   });
  // });
}
