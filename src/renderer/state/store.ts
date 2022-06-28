import { configureStore } from '@reduxjs/toolkit';
import { StoreState } from '../types';
import { logger, queueSong, saveToStorage } from './middleware';
import reducer, { initialState } from './reducer';

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(logger, saveToStorage, queueSong),
  preloadedState: initialState,
  devTools: !process.env.PRODUCTION
});

window.state.load().then((state: StoreState | null) => {
  store.dispatch({
    type: 'LOAD_STORAGE',
    state: state || initialState
  });
});

export default store;
