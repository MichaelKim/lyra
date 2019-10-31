// @flow strict

import storage from 'electron-json-storage';
import { applyMiddleware, createStore, compose } from 'redux';

import reducer from './reducer';
import { initialState } from './storage';
import { logger, saveToStorage } from './middleware';

import type { StoreState, Action, Dispatch } from '../types';

const composeEnhancers =
  process.env.NODE_ENV !== 'production'
    ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose)
    : compose;

const store = createStore<StoreState, Action, Dispatch>(
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
