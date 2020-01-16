// @flow strict

import fs from 'fs';
import { createStore, applyMiddleware } from 'redux';

import reducer from './reducer';
import { logger, saveToStorage } from './middleware';
import { initialState } from './storage';

import type { StoreState, Action, Dispatch } from '../types';

const store = createStore<StoreState, Action, Dispatch>(
  reducer,
  initialState,
  applyMiddleware(logger, saveToStorage)
);

fs.readFile('state.json', 'utf-8', (err, data) => {
  let state = initialState;
  if (err == null) {
    try {
      state = JSON.parse(data);
    } catch {
      state = initialState;
    }
  }
  store.dispatch({
    type: 'LOAD_STORAGE',
    state
  });
});

export default store;
