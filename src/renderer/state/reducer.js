// @flow strict

import u from 'updeep';
import { initialState } from './storage';
import { values } from '../util';

import type { StoreState, Action, Song, SongID, SortType } from '../types';

export default function rootReducer(
  state: StoreState = initialState,
  action: Action
): StoreState {
  switch (action.type) {
    case 'LOAD_STORAGE':
      return u({ loaded: true }, state);

    case 'SELECT_SONG': {
      const { id } = action.song;
      const { queue } = state;

      if (state.songs[id] != null || queue.cache[id] != null) {
        return u(
          {
            queue: {
              prev:
                queue.curr != null ? [...queue.prev, queue.curr] : queue.prev,
              curr: id
            }
          },
          state
        );
      }

      return u(
        {
          queue: {
            prev: queue.curr != null ? [...queue.prev, queue.curr] : queue.prev,
            curr: id,
            cache: {
              [id]: action.song
            }
          }
        },
        state
      );
    }

    case 'SELECT_PLAYLIST':
      return u(
        {
          currScreen: action.id
        },
        state
      );

    case 'ADD_SONGS': {
      const newSongs: $Shape<typeof state.songs> = action.songs.reduce(
        (acc, song) => {
          acc[song.id] = song;
          return acc;
        },
        {}
      );

      return u(
        {
          songs: newSongs
        },
        state
      );
    }

    case 'REMOVE_SONG': {
      const { queue, songs } = state;
      if (songs[action.id] == null) {
        return state;
      }

      return u(
        {
          songs: {
            [action.id]: null
          },
          queue: {
            prev: queue.prev.filter(p => p !== action.id),
            curr: queue.curr === action.id ? null : action.id,
            next: queue.next.filter(p => p !== action.id)
          }
        },
        state
      );
    }

    case 'CREATE_PLAYLIST':
      return u(
        {
          playlists: {
            [action.playlist.id]: action.playlist
          }
        },
        state
      );

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
        return u(
          {
            playlists: {
              [action.id]: null
            },
            songs,
            currScreen: null
          },
          state
        );
      }

      return u(
        {
          playlists: {
            [action.id]: null
          },
          songs
        },
        state
      );
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

      return u(
        {
          songs: {
            [sid]: {
              playlists: pids
            }
          }
        },
        state
      );
    }

    case 'CHANGE_VOLUME': {
      return u(
        {
          volume: Math.max(Math.min(action.volume, 100), 0)
        },
        state
      );
    }

    case 'SKIP_PREVIOUS': {
      const { queue } = state;
      const { prev, curr, next } = queue;
      if (curr == null) {
        // Nothing playing right now
        return state;
      }

      return u(
        {
          queue: {
            prev: prev.slice(0, -1),
            curr: prev[prev.length - 1],
            next: [curr, ...next]
          }
        },
        state
      );
    }

    case 'SKIP_NEXT': {
      const { queue } = state;
      const { prev, curr, next } = queue;
      if (curr == null) {
        // Nothing playing right now
        return state;
      }

      // Middleware: queues song if next is empty
      return u(
        {
          queue: {
            prev: [...prev, curr],
            curr: next[0],
            next: next.slice(1)
          }
        },
        state
      );
    }

    case 'UPDATE_TAGS': {
      const song = values<SongID, Song>(state.songs).find(
        song => song.id === action.id
      );
      if (song == null) {
        return state;
      }

      return u(
        {
          songs: {
            [song.id]: {
              title: action.title,
              artist: action.artist
            }
          }
        },
        state
      );
    }

    case 'SET_SORT': {
      const sort: SortType = {
        column: action.column,
        direction: action.direction
      };
      return u(
        {
          sort
        },
        state
      );
    }

    case 'SET_SHUFFLE': {
      return u(
        {
          shuffle: action.shuffle
        },
        state
      );
    }

    case 'QUEUE_SONG': {
      const { song } = action;

      if (state.songs[song.id] != null || state.queue.cache[song.id] != null) {
        return u(
          {
            queue: {
              next: [...state.queue.next, song.id]
            }
          },
          state
        );
      }

      return u(
        {
          queue: {
            next: [...state.queue.next, song.id],
            cache: {
              [song.id]: song
            }
          }
        },
        state
      );
    }

    case 'DOWNLOAD_ADD': {
      return u(
        {
          dlQueue: [...state.dlQueue, action.id]
        },
        state
      );
    }

    case 'DOWNLOAD_PROGRESS': {
      return u(
        {
          dlProgress: action.progress
        },
        state
      );
    }

    case 'DOWNLOAD_FINISH': {
      if (action.song == null) {
        return u(
          {
            dlQueue: state.dlQueue.slice(1),
            dlProgress: 0
          },
          state
        );
      }

      return u(
        {
          songs: {
            [action.song.id]: action.song
          },
          dlQueue: state.dlQueue.slice(1),
          dlProgress: 0
        },
        state
      );
    }

    case 'CLEAR_DATA':
      return u(
        {
          loaded: true
        },
        state
      );

    default:
      return state;
  }
}
