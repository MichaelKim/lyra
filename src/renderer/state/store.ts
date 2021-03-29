// @flow strict

import { ipcRenderer } from 'electron';
import { applyMiddleware, compose, createStore } from 'redux';
import type { Action, Dispatch, StoreState } from '../types';
import { logger, queueSong, saveToStorage } from './middleware';
import reducer from './reducer';
import { initialState } from './storage';

import type { Store } from 'redux';

const composeEnhancers =
  (!process.env.PRODUCTION &&
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose)) ||
  compose;

const store: Store<StoreState, Action, Dispatch> = createStore<
  StoreState,
  Action,
  Dispatch
>(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(logger, saveToStorage, queueSong))
);

ipcRenderer.on('state-load', (_, state: StoreState) => {
  store.dispatch({
    type: 'LOAD_STORAGE',
    state
  });
});

export default store;
