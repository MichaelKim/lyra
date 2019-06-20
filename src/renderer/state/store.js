// @flow strict

import { createStore, applyMiddleware } from 'redux';

import storage from 'electron-json-storage';

import reducer from './reducer';
import { logger, saveToStorage } from './middleware';
import { initialState } from './storage';

import type { StoreState, Store } from '../types';

const store: Store = createStore(
  reducer,
  initialState,
  applyMiddleware(logger, saveToStorage)
);

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
