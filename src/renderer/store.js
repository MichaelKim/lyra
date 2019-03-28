// @flow strict

import { createStore } from 'redux';

import type { StoreState, Action } from './types';

const initialState: StoreState = {
  songs: []
};

function reducer(state: StoreState = initialState, action: Action) {
  console.log(action);
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

    case 'ADD_SONGS':
      return {
        ...state,
        songs: state.songs.concat(action.songs)
      };

    default:
      return state;
  }
}

const store = createStore(reducer, initialState);

export default store;
