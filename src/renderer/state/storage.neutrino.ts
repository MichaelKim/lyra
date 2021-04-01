import fs from 'fs';
import { StoreState } from '../types';
import { initialState } from './reducer';

export function save(state: StoreState) {
  fs.writeFile('state.json', JSON.stringify(state), err => {
    if (err) console.log(err);
    else console.log('Stored state:', state);
  });
}

export function clear() {
  fs.writeFile('state.json', JSON.stringify(initialState), err => {
    if (err) console.log(err);
    else console.log('Cleared state');
  });
}
