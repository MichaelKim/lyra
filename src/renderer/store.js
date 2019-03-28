// @flow strict

import { createStore } from 'redux';

import type { StoreState, Action } from './types';

const initialState: StoreState = {
  directories: ['C:/Users/Michael/Music/']
};

function reducer(state: StoreState = initialState, action: Action) {
  switch (action.type) {
    case 'SELECT_SONG':
      return {
        ...state,
        current: action.song
      };

    case 'SELECT_PLAYLIST':
      return {
        ...state,
        playlist: action.name
      };

    case 'SET_DIRECTORIES':
      return {
        ...state,
        directories: action.dirs
      };

    default:
      return state;
  }
}

const store = createStore(reducer, initialState);

export default store;
