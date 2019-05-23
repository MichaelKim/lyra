// @flow strict

import { save, initialState } from './storage';
import { getSongList } from '../util';

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

    case 'DELETE_PLAYLIST':
      const playlist = state.playlists[action.id];
      if (playlist == null) {
        return state;
      }

      const playlists = state.playlists;
      const songs = state.songs;

      playlist.songs.forEach(id => {
        const index = songs[id].playlists.indexOf(action.id);
        if (index !== -1) songs[id].playlists.splice(index, 1);
      });
      delete playlists[action.id];

      return {
        ...state,
        playlists,
        songs
      };

    case 'CHANGE_VOLUME': {
      return {
        ...state,
        volume: Math.max(Math.min(action.volume, 100), 0)
      };
    }

    case 'SKIP_PREVIOUS':
    case 'SKIP_NEXT': {
      const { currSong } = state;
      if (currSong == null) {
        // Nothing is playing right now
        return state;
      }

      const songs = getSongList(state.songs, state.currScreen);
      const index = songs.findIndex(song => song.id === currSong.id);
      if (action.type === 'SKIP_PREVIOUS') {
        if (index <= 0) {
          return state;
        }
        return {
          ...state,
          currSong: songs[index - 1]
        };
      }

      if (index < 0 || index >= songs.length - 1) {
        return state;
      }
      return {
        ...state,
        currSong: songs[index + 1]
      };
    }

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
    case 'SELECT_SONG':
    case 'CREATE_PLAYLIST':
    case 'SELECT_PLAYLIST':
    case 'DELETE_PLAYLIST':
    case 'CHANGE_VOLUME':
    case 'SKIP_PREVIOUS':
    case 'SKIP_NEXT':
    case 'CLEAR_DATA':
      save(newState);
      break;
  }

  return newState;
}

export default saveWrapper;
