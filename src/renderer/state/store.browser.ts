import { applyMiddleware, compose, createStore, Store } from 'redux';
import { Action, StoreState } from '../types';
import { logger, queueSong, saveToStorage } from './middleware';
import reducer from './reducer';
import { initialState } from './reducer';

const composeEnhancers =
  (!process.env.PRODUCTION && // @ts-expect-error: inserted by devtools
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose)) ||
  compose;

const store: Store<StoreState, Action> = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(logger, saveToStorage, queueSong))
);

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
