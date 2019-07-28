// @flow strict

import { createStore, applyMiddleware, compose } from 'redux';

import storage from 'electron-json-storage';

import reducer from './reducer';
import { logger, saveToStorage } from './middleware';
import { initialState } from './storage';

import type { Store } from '../types';

const composeEnhancers =
  (process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
const store: Store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(logger, saveToStorage))
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
