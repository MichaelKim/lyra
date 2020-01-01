// @flow strict

import { applyMiddleware, createStore, compose } from 'redux';

import reducer from './reducer';
import { initialState } from './storage';
import { logger, saveToStorage, queueSong } from './middleware';

import type { StoreState, Action, Dispatch } from '../types';

const composeEnhancers = process.env.PRODUCTION
  ? compose
  : (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose);

const store = createStore<StoreState, Action, Dispatch>(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(logger, saveToStorage, queueSong))
);

let state = window.localStorage.getItem('state');
try {
  state = JSON.parse(state);
} finally {
  if (!state) state = initialState;
}

store.dispatch({
  type: 'LOAD_STORAGE',
  state
});

export default store;
