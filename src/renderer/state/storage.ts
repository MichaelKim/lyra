import { StoreState } from '../types';

export function save(state: StoreState) {
  window.state.save(state);
  console.log('Stored state:', state);
}

export function clear() {
  window.state.clear();
}
