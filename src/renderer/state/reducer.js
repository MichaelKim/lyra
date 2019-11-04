// @flow strict

import { initialState } from './storage';
import { values } from '../util';

import type { StoreState, Action, Song, SongID } from '../types';

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

    case 'SELECT_SONG': {
      const { id } = action.song;
      const { queue } = state;

      if (state.songs[id] != null || queue.cache[id] != null) {
        return {
          ...state,
          queue: {
            ...queue,
            prev: queue.curr != null ? [...queue.prev, queue.curr] : queue.prev,
            curr: id
          }
        };
      }

      return {
        ...state,
        queue: {
          ...queue,
          prev: queue.curr != null ? [...queue.prev, queue.curr] : queue.prev,
          curr: id,
          cache: {
            ...queue.cache,
            [id]: action.song
          }
        }
      };
    }

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

      return {
        ...state,
        songs: {
          ...state.songs,
          [action.id]: null
        },
        queue: {
          ...state.queue,
          prev: state.queue.prev.filter(p => p !== action.id),
          curr: state.queue.curr === action.id ? null : action.id,
          next: state.queue.next.filter(p => p !== action.id)
        }
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

      const songs = state.songs;

      playlist.songs.forEach(id => {
        const index = songs[id].playlists.indexOf(action.id);
        if (index !== -1) songs[id].playlists.splice(index, 1);
      });

      if (state.currScreen === action.id) {
        return {
          ...state,
          playlists: {
            ...state.playlists,
            [action.id]: null
          },
          songs,
          currScreen: null
        };
      }

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [action.id]: null
        },
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

    case 'SKIP_PREVIOUS': {
      const { queue } = state;
      const { prev, curr, next } = queue;
      if (curr == null) {
        // Nothing playing right now
        return state;
      }

      return {
        ...state,
        queue: {
          ...queue,
          prev: prev.slice(0, -1),
          curr: prev[prev.length - 1],
          next: [curr, ...next]
        }
      };
    }

    case 'SKIP_NEXT': {
      const { queue } = state;
      const { prev, curr, next } = queue;
      if (curr == null) {
        // Nothing playing right now
        return state;
      }

      // Middleware: queues song if next is empty
      return {
        ...state,
        queue: {
          ...queue,
          prev: [...prev, curr],
          curr: next[0],
          next: next.slice(1)
        }
      };
    }

    case 'UPDATE_TAGS': {
      const song = values<SongID, Song>(state.songs).find(
        song => song.id === action.id
      );
      if (song == null) {
        return state;
      }

      const updated = {
        ...song,
        title: action.title,
        artist: action.artist
      };

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

    case 'QUEUE_SONG': {
      const { song } = action;

      if (state.songs[song.id] != null || state.queue.cache[song.id] != null) {
        return {
          ...state,
          queue: {
            ...state.queue,
            next: [...state.queue.next, song.id]
          }
        };
      }

      return {
        ...state,
        queue: {
          ...state.queue,
          next: [...state.queue.next, song.id],
          cache: {
            ...state.queue.cache,
            [song.id]: song
          }
        }
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
