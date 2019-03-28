// @flow strict

import { save, initialState } from './storage';

import type { StoreState, Action, Song } from '../types';

function rootReducer(state: StoreState = initialState, action: Action) {
  console.log(action);
  switch (action.type) {
    case 'LOAD_STORAGE':
      return {
        ...state,
        loaded: true,
        songs: action.songs
      };

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
      const newSongs: Song[] = state.songs.concat(action.songs);
      return {
        ...state,
        songs: newSongs
      };

    default:
      return state;
  }
}

function saveWrapper(state: StoreState = initialState, action: Action) {
  const newState = rootReducer(state, action);

  switch (action.type) {
    case 'ADD_SONGS':
      save(newState);
      break;
  }

  return newState;
}

export default saveWrapper;
