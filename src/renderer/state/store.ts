import { ipcRenderer } from 'electron';
import { applyMiddleware, compose, createStore, Store } from 'redux';
import { Action, StoreState } from '../types';
import { logger, queueSong, saveToStorage } from './middleware';
import reducer from './reducer';
import { initialState } from './storage';

const composeEnhancers = !process.env.PRODUCTION
  ? // @ts-expect-error: inserted by devtools
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose)
  : compose;

const store: Store<StoreState, Action> = createStore(
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
