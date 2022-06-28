import { configureStore } from '@reduxjs/toolkit';
import { logger, queueSong, saveToStorage } from './middleware';
import reducer, { initialState } from './reducer';

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(logger, saveToStorage, queueSong),
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

store.dispatch({
  type: 'LOAD_STORAGE',
  state: getState()
});

export default store;
