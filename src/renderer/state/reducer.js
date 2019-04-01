// @flow strict

import { save, initialState } from './storage';

import type { StoreState, Action, Song } from '../types';

function rootReducer(state: StoreState = initialState, action: Action) {
  console.log(action);
  switch (action.type) {
    case 'LOAD_STORAGE':
      return {
        ...action.state,
        loaded: true
      };

    case 'SELECT_SONG':
      return {
        ...state,
        currSong: action.song
      };

    case 'SELECT_PLAYLIST':
      return {
        ...state,
        currScreen: action.name
      };

    case 'ADD_SONGS':
      return action.songs.reduce(
        (acc, song) => ({
          ...acc,
          songs: {
            ...acc.songs,
            [song.id]: song
          }
        }),
        state
      );

    case 'CREATE_PLAYLIST':
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [action.playlist.id]: action.playlist
        }
      };

    case 'CLEAR_DATA':
      return {
        ...initialState,
        loaded: true
      };

    default:
      return state;
  }
}

function saveWrapper(state: StoreState = initialState, action: Action) {
  const newState = rootReducer(state, action);

  switch (action.type) {
    case 'ADD_SONGS':
    case 'CREATE_PLAYLIST':
    case 'CLEAR_DATA':
      save(newState);
      break;
  }

  return newState;
}

export default saveWrapper;
