// @flow strict

import { applyMiddleware, createStore, compose } from 'redux';

import reducer from './reducer';
import { initialState } from './storage';
import { logger, saveToStorage, queueSong } from './middleware';

import type { StoreState, Action, Dispatch } from '../types';

const composeEnhancers = process.env.PRODUCTION
  ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose)
  : compose;

const store = createStore<StoreState, Action, Dispatch>(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(logger, saveToStorage, queueSong))
);

// TODO: browser storage
store.dispatch({
  type: 'LOAD_STORAGE',
  state: initialState
});

export default store;
