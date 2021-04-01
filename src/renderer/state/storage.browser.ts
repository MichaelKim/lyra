import { StoreState } from '../types';

export function save(state: StoreState) {
  try {
    window.localStorage.setItem('state', JSON.stringify(state));
    console.log('Stored state:', state);
  } catch (err) {
    console.log(err);
  }
}

export function clear() {
  window.localStorage.removeItem('state');
}
