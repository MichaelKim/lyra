// @flow strict

import { createStore } from 'redux';

import storage from 'electron-json-storage';

import reducer from './reducer';
import { initialState } from './storage';

import type { StoreState, Store } from '../types';

const store: Store = createStore(reducer, initialState);

storage.has('state', (err, exists) => {
  if (err) return;

  if (!exists) {
    store.dispatch({
      type: 'LOAD_STORAGE',
      state: initialState
    });

    return;
  }

  storage.get('state', (err, state) => {
    if (err) return;

    store.dispatch({
      type: 'LOAD_STORAGE',
      state
    });
  });
});

export default store;
