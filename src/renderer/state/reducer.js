// @flow strict

import { initialState } from './storage';
import { values, getSongList } from '../util';

import type { StoreState, Action } from '../types';

export default function rootReducer(
  state: StoreState = initialState,
  action: Action
): StoreState {
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
        currScreen: action.id
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

    case 'REMOVE_SONG': {
      const { songs } = state;
      if (songs[action.id] == null) {
        return state;
      }

      delete songs[action.id];

      if (state.currSong != null && state.currSong.id === action.id) {
        return {
          ...state,
          songs,
          currSong: undefined
        };
      }

      return {
        ...state,
        songs
      };
    }

    case 'CREATE_PLAYLIST':
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [action.playlist.id]: action.playlist
        }
      };

    case 'DELETE_PLAYLIST': {
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

      if (state.currScreen === action.id) {
        return {
          ...state,
          playlists,
          songs,
          currScreen: null
        };
      }

      return {
        ...state,
        playlists,
        songs
      };
    }

    case 'SET_PLAYLISTS': {
      const { sid, pids } = action;
      const song = state.songs[sid];

      // Invalid song ID
      if (song == null) {
        return state;
      }

      for (let pid of pids) {
        // Invalid playlist ID
        if (state.playlists[pid] == null) {
          return state;
        }
      }

      return {
        ...state,
        songs: {
          ...state.songs,
          [sid]: {
            ...state.songs[sid],
            playlists: pids
          }
        }
      };
    }

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

      // Enable autoplay for youtube if shuffle is on
      if (state.shuffle && currSong.source === 'YOUTUBE') {
        if (!state.nextSong) return state;

        return {
          ...state,
          currSong: state.nextSong,
          nextSong: null
        };
      }

      if (state.shuffle) {
        const songs = getSongList(state.songs, state.currScreen).filter(
          song => song.id !== currSong.id
        );
        return {
          ...state,
          currSong: songs[0 | (Math.random() * songs.length)]
        };
      }

      const songs = getSongList(state.songs, state.currScreen, state.sort);
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

    case 'UPDATE_TAGS': {
      const song = values(state.songs).find(song => song.id === action.id);
      if (song == null) {
        return state;
      }

      // Using ...spread doesn't work with Flow
      const updated = Object.assign(song, {
        title: action.title,
        artist: action.artist
      });

      if (state.currSong != null && state.currSong.id === action.id) {
        return {
          ...state,
          songs: {
            ...state.songs,
            [song.id]: updated
          },
          currSong: updated
        };
      }

      return {
        ...state,
        songs: {
          ...state.songs,
          [song.id]: updated
        }
      };
    }

    case 'SET_SORT': {
      return {
        ...state,
        sort: {
          column: action.column,
          direction: action.direction
        }
      };
    }

    case 'SET_SHUFFLE': {
      return {
        ...state,
        shuffle: action.shuffle
      };
    }

    case 'SET_NEXT_SONG': {
      const { song } = action;

      if (state.songs[song.id] != null) {
        return {
          ...state,
          nextSong: state.songs[song.id]
        };
      }

      return {
        ...state,
        nextSong: song
      };
    }

    case 'DOWNLOAD_ADD': {
      return {
        ...state,
        dlQueue: [...state.dlQueue, action.id]
      };
    }

    case 'DOWNLOAD_PROGRESS': {
      return {
        ...state,
        dlProgress: action.progress
      };
    }

    case 'DOWNLOAD_FINISH': {
      if (action.song == null) {
        return {
          ...state,
          dlQueue: state.dlQueue.slice(1),
          dlProgress: 0
        };
      }

      return {
        ...state,
        songs: {
          ...state.songs,
          [action.song.id]: action.song
        },
        dlQueue: state.dlQueue.slice(1),
        dlProgress: 0
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
