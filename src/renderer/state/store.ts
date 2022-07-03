import { configureStore } from '@reduxjs/toolkit';
import { loadStorage } from '../actions';
import { StoreState } from '../types';
import { fetchNextSong, logger, saveToStorage } from './middleware';
import reducer, { initialState } from './reducer';

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(logger, saveToStorage, fetchNextSong),
  preloadedState: initialState,
  devTools: !process.env.PRODUCTION
});

export type AppDispatch = typeof store.dispatch;

window.state.load().then((state: StoreState | null) => {
  store.dispatch(loadStorage(state || initialState));
});

export default store;
