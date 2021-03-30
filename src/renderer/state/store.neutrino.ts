import fs from 'fs';
import { applyMiddleware, createStore, Store } from 'redux';
import { Action, StoreState } from '../types';
import { logger, saveToStorage } from './middleware';
import reducer from './reducer';
import { initialState } from './storage';

const store: Store<StoreState, Action> = createStore(
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
