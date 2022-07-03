import { configureStore } from '@reduxjs/toolkit';
import { loadStorage } from '../actions';
import { fetchNextSong, logger, saveToStorage } from './middleware';
import reducer, { initialState } from './reducer';

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(logger, saveToStorage, fetchNextSong),
  preloadedState: initialState,
  devTools: !process.env.PRODUCTION
});

function getState() {
  const stored = window.localStorage.getItem('state');
  if (stored == null) return initialState;
  try {
    return JSON.parse(stored);
  } catch {
    return initialState;
  }
}

store.dispatch(loadStorage(getState()));

export default store;
