import { configureStore } from '@reduxjs/toolkit';
import fs from 'fs';
import { loadStorage } from '../actions';
import { logger, saveToStorage } from './middleware';
import reducer, { initialState } from './reducer';

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(logger, saveToStorage),
  preloadedState: initialState
});

fs.readFile('state.json', 'utf-8', (err, data) => {
  let state = initialState;
  if (err == null) {
    try {
      state = JSON.parse(data);
    } catch {
      state = initialState;
    }
  }
  store.dispatch(loadStorage(state));
});

export default store;
